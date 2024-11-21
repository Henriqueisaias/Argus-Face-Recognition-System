import { Wanted } from "../models/Wanted.js";
import { GridFSBucket } from 'mongodb';
import { connect } from "../db/conn.js";
import { ObjectId } from "mongodb";
import mongoose from 'mongoose';
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";


const db = await connect();

let bucket;
mongoose.connection.on('connected', () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

  if (!bucket) {
    console.error('Erro: GridFSBucket não pode ser criado, conexão com DB falhou');
  } else {
    console.log('GridFSBucket criado com sucesso');
  }
});

export default class WantedController {
  static async register(req, res) {
    const { name, age, crimes, cpf, condemned, wanted } = req.body;
    const { file } = req;
  
    if (!name) return res.status(422).json({ message: "O nome é obrigatório" });
    if (!age) return res.status(422).json({ message: "A idade é obrigatória" });
    if (!crimes) return res.status(422).json({ message: "Crimes são obrigatórios" });
    if (!condemned) return res.status(422).json({ message: "O campo condenado é obrigatório" });
    if (wanted === undefined) return res.status(422).json({ message: "O campo wanted é obrigatório" });
    if (cpf === undefined) return res.status(422).json({ message: "O campo cpf é obrigatório" });
    if (!file) return res.status(422).json({ message: "A foto é obrigatória" });
  
    try {
      if (!bucket) {
        return res.status(500).json({ message: "Erro no bucket, tente novamente mais tarde" });
      }
  
     
      const uploadStream = bucket.openUploadStream(file.originalname);
  
     
      uploadStream.end(file.buffer);
  
      uploadStream.on('finish', async () => {
        
        const wantedPerson = new Wanted({
          name,
          age,
          crimes,  
          condemned,
          cpf,
          wanted,
          photo: uploadStream.id
        });
  
        await wantedPerson.save();
        res.status(201).json({ message: "Pessoa procurada registrada com sucesso!", data: wantedPerson });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao registrar pessoa procurada." });
    }
  }
  
  static async getAll(req, res) {

    try {
      
      const db = mongoose.connection.db;
  
      
      if (!db) {
        return res.status(500).json({ message: "Erro de conexão com o banco de dados." });
      }
  
      
      const allWanted = await Wanted.find();
  
      const results = await Promise.all(
        allWanted.map(async (wanted) => {
          const imgId = wanted.photo;
  
          if (!imgId) {
            return { ...wanted.toObject(), photo: null }; 
          }
  
          
          const imageBuffer = await db.collection("uploads.files").findOne({ _id: new ObjectId(imgId) });
  
          if (!imageBuffer) {
            console.log(`Imagem não encontrada no GridFS para o ID: ${imgId}`);
            return { ...wanted.toObject(), photo: null };
          }
  
          
          const imgData = await db.collection("uploads.chunks").find({ files_id: new ObjectId(imgId) }).toArray();
  
          if (!imgData.length) {
            console.log(`Sem chunks para a imagem com ID: ${imgId}`);
            return { ...wanted.toObject(), photo: null };
          }
  
          
          const imageChunks = imgData.map(chunk => chunk.data.buffer);
          const fullImageBuffer = Buffer.concat(imageChunks);
  
          
          const resizedImageBuffer = await sharp(fullImageBuffer)
            .resize(200)
            .toBuffer();
  
          
          const base64Image = resizedImageBuffer.toString("base64");
          const imgSrc = `data:image/jpeg;base64,${base64Image}`;
  
        
          return { ...wanted.toObject(), photo: imgSrc };
        })
      );
  
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar dados." });
    }
  }
  
  static async search(req, res) {
    try {
        const image = req.file;

        if (!image) {
            return res.status(400).send({ message: "Imagem não enviada" });
        }

        const formData = new FormData();
        formData.append("photo", image.buffer.toString("base64")); 
        const response = await axios.post(
            "http://localhost:8000/api/recognize/",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );

        const id = response.data.id;

        if (id && id !== "-1") {
            const target = await Wanted.findById(id);

            if (!target) {
                return res.status(404).send({ message: "Pessoa procurada não encontrada" });
            }

            const imgId = target.photo;

            if (!imgId) {
                return res.status(404).send({ message: "Imagem associada não encontrada" });
            }

            const db = mongoose.connection.db;

            const imageBuffer = await db.collection("uploads.files").findOne({ _id: new ObjectId(imgId) });

            if (!imageBuffer) {
                console.log(`Imagem não encontrada no GridFS para o ID: ${imgId}`);
                return res.json({ ...target.toObject(), photo: null });
            }

            const imgData = await db.collection("uploads.chunks").find({ files_id: new ObjectId(imgId) }).toArray();

            if (!imgData.length) {
                console.log(`Sem chunks para a imagem com ID: ${imgId}`);
                return res.json({ ...target.toObject(), photo: null });
            }

            const imageChunks = imgData.map(chunk => chunk.data.buffer);
            const fullImageBuffer = Buffer.concat(imageChunks);

            const resizedImageBuffer = await sharp(fullImageBuffer)
                .resize(200)
                .toBuffer();

            const base64Image = resizedImageBuffer.toString("base64");
            const imgSrc = `data:image/jpeg;base64,${base64Image}`;

            return res.json({ ...target.toObject(), photo: imgSrc });
        } else {
            console.log("ID inválido, retornando 400");
            return res.json({ message: "Nenhum rosto encontrado" });
            
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Erro inesperado: ${err.message}` });
    }
}


  static async getOne(req, res) {
    const cpf = req.params.cpf

    console.log("rota acessada")
    console.log(cpf)

    if (!cpf) {
      return res.send({ message: "Erro nenhum dado preenchido" });
    }

    try {
      const result = await Wanted.findOne({cpf: cpf});

      console.log(result)

      if (!result) {
        return res.send({ message: "nenhum resultado encontrado" });
      }

      const target = result

      const imgId = result.photo;

      
      if (!imgId) {
        return res.status(404).json({ message: "Imagem associada não encontrada" });
      }
    
      
      const db = mongoose.connection.db;
      if (!db) {
        return res.status(500).json({ message: "Erro de conexão com o banco de dados." });
      }
    
      
      const imageBuffer = await db.collection("uploads.files").findOne({ _id: new ObjectId(imgId) });
    
      
      if (!imageBuffer) {
        console.log(`Imagem não encontrada no GridFS para o ID: ${imgId}`);
        return res.json({ ...target.toObject(), photo: null });
      }
    
      
      const imgData = await db.collection("uploads.chunks").find({ files_id: new ObjectId(imgId) }).toArray();
    
      
      if (!imgData.length) {
        console.log(`Sem chunks para a imagem com ID: ${imgId}`);
        return res.json({ ...target.toObject(), photo: null });
      }
    
      
      const imageChunks = imgData.map(chunk => chunk.data.buffer);
      const fullImageBuffer = Buffer.concat(imageChunks);
    
     
      const resizedImageBuffer = await sharp(fullImageBuffer)
        .resize(200)
        .toBuffer();
    
      const base64Image = resizedImageBuffer.toString("base64");
      const imgSrc = `data:image/jpeg;base64,${base64Image}`;
    
      
      res.json({ ...target.toObject(), photo: imgSrc });  


    

    } catch (err) {
      res.status(500).send({ message: `Ocorreu um erro no servidor: ${err}` });
      console.log(err);
    }
  }

  static async deleteWanted(req, res) {
    const id = req.body.id

    Wanted.deleteOne({_id: id})
  }

  static async update(req, res) {
    const { name, age, crimes, cpf, condemned, wanted } = req.body;
    const { file } = req;
    const { id } = req.params; 

    if (!name) return res.status(422).json({ message: "O nome é obrigatório" });
    if (!age) return res.status(422).json({ message: "A idade é obrigatória" });
    if (!crimes) return res.status(422).json({ message: "Crimes são obrigatórios" });
    if (!condemned) return res.status(422).json({ message: "O campo condenado é obrigatório" });
    if (!cpf) return res.status(422).json({ message: "O campo cpf é obrigatório" });
    if (wanted === undefined) return res.status(422).json({ message: "O campo wanted é obrigatório" });

    try {
        if (!bucket) {
            return res.status(500).json({ message: "Erro no bucket, tente novamente mais tarde" });
        }

        const wantedPerson = await Wanted.findById(id);
        if (!wantedPerson) {
            return res.status(404).json({ message: "Pessoa procurada não encontrada" });
        }

        if (file) {
            
            if (wantedPerson.photo) {
                await bucket.delete(wantedPerson.photo);
            }

           
            const uploadStream = bucket.openUploadStream(file.originalname);
            uploadStream.end(file.buffer);

            uploadStream.on('finish', async () => {
                wantedPerson.photo = uploadStream.id;
                await wantedPerson.save();
            });
        }

        
        wantedPerson.name = name;
        wantedPerson.age = age;
        wantedPerson.crimes = crimes;
        wantedPerson.condemned = condemned;
        wantedPerson.cpf = cpf;
        wantedPerson.wanted = wanted;

        const updatedPerson = await Wanted.findByIdAndUpdate(id, wantedPerson, { new: true });
        res.status(200).json({ message: "Pessoa procurada atualizada com sucesso!", data: updatedPerson });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar pessoa procurada." });
    }
}

}

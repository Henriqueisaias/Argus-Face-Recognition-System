import { Wanted } from "../models/Wanted.js";
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { connect } from "../db/conn.js";
import { ObjectId } from "mongodb";
import multer from 'multer';
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";


const db = await connect();

if (mongoose.connection.readyState === 0) {
  mongoose.connect('mongodb://localhost:27017/faces', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB conectado');
  }).catch((err) => {
    console.error('Erro ao conectar no MongoDB', err);
  });
} else {
  console.log('Já existe uma conexão ativa com o MongoDB');
}


let bucket;
mongoose.connection.on('connected', () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

  if (!bucket) {
    console.error('Erro: GridFSBucket não pode ser criado, conexão com DB falhou');
  } else {
    console.log('GridFSBucket criado com sucesso');
  }
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default class WantedController {
  static async register(req, res) {
    const { name, age, crimes, condemned, wanted } = req.body;
    const { file } = req;
  
    if (!name) return res.status(422).json({ message: "O nome é obrigatório" });
    if (!age) return res.status(422).json({ message: "A idade é obrigatória" });
    if (!crimes) return res.status(422).json({ message: "Crimes são obrigatórios" });
    if (!condemned) return res.status(422).json({ message: "O campo condenado é obrigatório" });
    if (wanted === undefined) return res.status(422).json({ message: "O campo wanted é obrigatório" });
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
  
      res.json(results);  // Envia os resultados com as fotos em base64
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar dados." });
    }
  }
  

  static async search(req, res) {
    try {
      const image = req.file;

      if (image) {
        console.log("veio");
      } else {
        console.log("não veio");
      }

      if (!image) {
        return res.status(400).send({ message: "Imagem não enviada" });
      }

      const form = new FormData();
      form.append("image", image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });

      const response = await axios.post(
        "http://localhost:8000/api/recognize/",
        form,
        {
          headers: form.getHeaders(),
        }
      );

      const id = response.data;
      console.log(id);

      if (id !== -1) {
        const target = await db
          .collection("wanteds")
          .findOne({ _id: new ObjectId(id) });

        if (!target) {
          return res.status(404).send([]);
        }

        const imgId = target.foto;

        const imgData = await db
          .collection("uploads.chunks")
          .find({ files_id: new ObjectId(imgId) })
          .toArray();

        if (!imgData.length) {
          return res.send({ ...target, photo: null });
        }

        const imageChunks = imgData.map((chunk) => chunk.data.buffer);
        const fullImageBuffer = Buffer.concat(imageChunks);

        const resizedImageBuffer = await sharp(fullImageBuffer)
          .resize(200)
          .toBuffer();

        const base64Image = resizedImageBuffer.toString("base64");
        console.log(base64Image);
        const imgSrc = `data:image/jpeg;base64,${base64Image}`;

        res.send({ ...target, photo: imgSrc });
      } else {
        res.send({ message: "Nenhum resultado satisfatório" });
      }
    } catch (err) {
      res.status(500).send({ message: `Erro inesperado: ${err.message}` });
    }
  }

  static async getOne(req, res) {
    const { name, age, crimes, condemned, wanted,} = req.body;

    if (!name && !age && !crimes && !condemned && !wanted) {
      return res.send({ message: "Erro nenhum dado preenchido" });
    }

    const wantedGetOne = { name, age, crimes, condemned, wanted, photo };

    try {
      const result = await Wanted.findOne({ ...wantedGetOne });

      if (!result) {
        res.send({ message: "nenhum resultado encontrado" });
      } else {
        res.send(result);
      }
    } catch (err) {
      res.status(500).send({ message: `Ocorreu um erro no servidor: ${err}` });
      console.log(err);
    }
  }

  static async deleteWanted(req, res) {
    const id = req.body.id

    Wanted.deleteOne({_id: id})
  }

  static async updateWanted(req, res) {
  }
}

import { Wanted } from "../models/Wanted.js";
import { connect } from "../db/conn.js";
import { ObjectId } from "mongodb";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";

const db = await connect();

export default class WantedController {
  static async register(req, res) {
    const { name, age, crimes, photo } = req.body;

    if (!name) {
      return res.status(422).json({ message: "O nome é obrigatório" });
    }
    if (!age) {
      return res.status(422).json({ message: "A idade é obrigatória" });
    }
    if (!crimes) {
      return res.status(422).json({ message: "Crimes são obrigatórios" });
    }
    if (!photo) {
      return res.status(422).json({ message: "A foto é obrigatória" });
    }

    res.status(201).json({ message: "Registro criado com sucesso!" });
  }

  static async getAll(req, res) {
    try {
      const allWanted = await Wanted.find();

      // depois mexer nisso daqui pra ficar mais limpo

      const results = await Promise.all(
        allWanted.map(async (wanted) => {
          const imgId = wanted.photo;

          const imageBuffer = await db

            .collection("fs.files")
            .findOne({ _id: imgId });

          const imgData = await db

            .collection("fs.chunks")
            .find({ files_id: imgId })
            .toArray();

          if (!imgData.length) {
            return { ...wanted, photo: null };
          }

          const imageChunks = imgData.map((chunk) => chunk.data.buffer);
          const fullImageBuffer = Buffer.concat(imageChunks);

          const resizedImageBuffer = await sharp(fullImageBuffer)
            .resize(200)
            .toBuffer();

          const base64Image = resizedImageBuffer.toString("base64");
          const imgSrc = `data:image/jpeg;base64,${base64Image}`;

          return { ...wanted, photo: imgSrc };
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
          .collection("wanted")
          .findOne({ _id: new ObjectId(id) });

        if (!target) {
          return res.status(404).send([]);
        }

        const imgId = target.foto;

        const imgData = await db
          .collection("fs.chunks")
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
    const { name, age, crimes, condemned, wanted, photo } = req.body;

    if (!name && !age && !crimes && !condemned && !wanted && !photo) {
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
}

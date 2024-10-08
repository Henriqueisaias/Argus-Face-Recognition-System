import { Wanted } from "../models/Wanted.mjs";
import { connect } from "../db/conn.mjs";

export default class WantedController {
  static async register(req, res) {
    const { name, age, crimes, photo } = req.body;
    // validações

    // se os dados vieram
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatorio" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória" });
      return;
    }

    if (!crimes) {
      res
        .status(422)
        .json({ message: "Crimes são obrigatórios" });
      return;
    }

    if (!photo) {
      res.status(422).json({ message: "A foto é obrigatória" });
      return;
    }

    if (!location) {
        res.status(422).json({ message: "O local é obrigatório" });
        return;
    }

    if (!seen) {
        res.status(422).json({ message: "A Data da ultima vez visto, é obrigatoria" });
        return;
    }

    // ver se as variaveis estão cheias
    console.log("nome:", name);
    console.log("age:", age);
    console.log("Crimes:", crimes);
    console.log("foto:", photo);
    console.log("seen:", seen);
    console.log("location:", location);


    // checar se o usuário existe
    const db = await connect();
    const wantedExists = await db.collection("wanted").findOne({ user: user });

    if (userExists) {
      res.status(422).json({
        message: "erro, esse usuário já existe",
      });
      return;
    }

    // criação da senha criptografada
    // const salt = await bcrypt.gens;

    // const db = await connect();

    // try {
    //   await db
    //     .collection("users")
    //     .insertOne({
    //       user: user,
    //       password: password,
    //       permission: permission,
    //       confirmpassword: confirmpassword,
    //     });
    //   console.log("inserido com sucesso no banco");
    //   res.send("inserido no banco com sucesso");
    // } catch (err) {
    //   console.log(err);
    // }
  }

  static async getAll(req, res) {
    const db = await connect();

    try {
      const allWanted = await db.collection("wanted").find().toArray()
      res.json(allWanted)
      console.log("dados enviados")
    } catch (err) {
      console.log(allWanted);
      
    }
  }
}

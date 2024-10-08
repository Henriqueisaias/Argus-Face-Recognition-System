import { User } from "../models/User.mjs";
import { connect } from "../db/conn.mjs";

export default class UserController {
  static async register(req, res) {
    const { user, password, confirmpassword, permission } = req.body;
    // validações

    // se os dados vieram
    if (!user) {
      res.status(422).json({ message: "O nome de usuário é obrigatorio" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    if (permission != "admin" && permission != "basic") {
      res
        .status(422)
        .json({ message: "a permissão tem quer ser admin ou basic" });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ message: "a confirmação da senha é obrigatória" });
      return;
    }

    // se as senhas são iguais
    if (confirmpassword !== password) {
      res.status(422).json({ message: "as senhas informada não coincidem" });
      return;
    }



    // ver se as variaveis estão cheias
    console.log("Usuário:", user);
    console.log("Senha:", password);
    console.log("Senha Confirmada:", confirmpassword);
    console.log("Permissão:", permission);

    // checar se o usuário existe
    const db = await connect();
    const userExists = await db.collection("users").findOne({ user: user });

    if (userExists) {
      res.status(422).json({
        message: "erro, esse usuário já existe",
      });
      return;
    }

    // criação da senha criptografada
    // const salt = await bcrypt.gens;

    // const db = await connect();

    try {
      await db.collection("users").insertOne({
          user: user,
          password: password,
          permission: permission,
          confirmpassword: confirmpassword,
        });
      console.log("inserido com sucesso no banco");
      res.send("inserido no banco com sucesso");
    } catch (err) {
      console.log(err);
    }
  }
}

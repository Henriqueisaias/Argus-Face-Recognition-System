import { User } from "../models/User.js";
import { connect } from "../db/conn.js";

const db = await connect();

export default class UserController {
  static async register(req, res) {

    const { user, string, password, confirmpassword, permission } = req.body;
    

    
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
  const userExists = await User.findOne({ user: user });

    if (userExists) {
      res.status(422).json({
        message: "erro, esse usuário já existe",
      });
      return;
    }

    // criação da senha criptografada
    // const salt = await bcrypt.gens;


    try {
      await User.insertOne({
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

  static async login (req, res) {
    // aqui vai o login e o envio do token
  }

  static async updateUser (req, res) {
    // aqui vai o update de user
  }

  static async deleteUser (req, res) {
    const id = req.params.id
    console.log("rota delete acessada")

    try{
    User.deleteOne({_id: id});
    res.send("deletado");
    }catch(err){
        console.log("erro" + err)
    }
    

  }

  static async getAllUsers (req, res) {
    
    
    console.log("rota acessada");
    const allUsers = await User.find().toArray();
    res.send(allUsers);

    
  }
}

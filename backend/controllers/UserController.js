import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { connect } from "../db/conn.js";
import createUserToken from "../helpers/createusertoken.js";

const db = await connect();

export default class UserController {
  static async register(req, res) {
    const { user, password, confirmpassword, permission } = req.body;

    
    
    console.log('Corpo da requisição:', req.body); // Log do corpo da requisição
    console.log("Valor de 'user' recebido:", user);
    console.log("Tipo de 'user':", typeof user);
    

    if (!user) {
      return res
        .status(422)
        .json({ message: "O nome de usuário é obrigatório" });
    }

    const userExists = await User.findOne({ user: user });

    if (userExists) {
      return res.status(422).json({ message: "Este usuário já existe" });
    }

    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória" });
    }

    if (permission !== "admin" && permission !== "basic") {
      return res
        .status(422)
        .json({ message: "A permissão deve ser 'admin' ou 'basic'" });
    }

    if (!confirmpassword) {
      return res
        .status(422)
        .json({ message: "A confirmação da senha é obrigatória" });
    }

    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ message: "As senhas informadas não coincidem" });
    }

    

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de saltos de criptografia

    try {
      const newUser = new User({
        user: user,
        password: hashedPassword, // Use a senha criptografada
        permision: permission,
      });

      // Salva o usuário no banco de dados
      await newUser.save();

      res.status(200).json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao registrar o usuário", error: err });
    }
  }

  static async login(req, res) {
    const user = req.body.user
    const password = req.body.password
    console.log(user, password)

    if (!user || !password) {
      return res
        .status(422)
        .json({ message: "Usuário e senha são obrigatórios" });
    }

    const userExists = await User.findOne({ user });
    console.log(userExists)
    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    console.log(passwordMatch)
    if (!passwordMatch) {
      return res.status(422).json({ message: "Senha inválida" });
    }

    createUserToken(userExists, req, res);
  }

  static async updateUser(req, res) {
    {
      const { id } = req.params;
      const { user, password, permission } = req.body;
  
      console.log("Rota de atualização acessada");
  
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id, 
          { user, password, permision: permission }, 
          { new: true }
        );
  
        res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao atualizar o usuário", error: err });
      }
    }
  }

  static async deleteUser(req, res) {
    const id = req.params.id;
    console.log("rota delete acessada");

    try {
      User.deleteOne({ _id: id });
      res.send("deletado");
    } catch (err) {
      console.log("erro" + err);
    }
  }

  static async getAllUsers(req, res) {
    console.log("rota acessada");
    const allUsers = await User.find().toArray();
    res.send(allUsers);
  }
}

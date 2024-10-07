import { Admin } from "mongodb";
import {User} from "../models/User.mjs"



export default class UserController {
    static async register(req, res) {
        const {user, password, confirmpassword, permission} = req.body
        // validações

        // se os dados vieram
        if(!user) {
            res.status(422).json({message: "O nome de usuário é obrigatorio"})
            return
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória"})
            return
        }

        if(permission != "admin" && permission != "basic") {
            res.status(422).json({message: "a permissão tem quer ser admin ou basic"})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: "a confirmação da senha é obrigatória"})
            return
        }

        // se as senhas são iguais
        if(confirmpassword !== password) {
            res.status(422).json({message: "as senhas informada não coincidem"})
            return
        }

        // checar se o usuário existe
        const userExists = await User.findOne({user: user})

        if(userExists) {
            res
            .status(422)
            .json({
                message: "erro, esse usuário já existe"
            })
            return
        }

        // criação da senha criptografada
        const salt = await bcrypt.gens


    }
}
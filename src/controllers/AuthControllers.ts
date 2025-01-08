import { Request , Response } from "express"
import { UserModel } from "../models/UserModels"
import { hasPassword } from "../utils/auth"
import { tokenModels } from "../models/TokenModels"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/AuthEmail"

export class AuthControllers {

    public static async createUser( req : Request , res : Response) {

        try {

            // comprobar que no exista ya el usuario
            const userExist = await UserModel.findOne({ email : req.body.email })
            
            if( userExist ) { 
                const error = new Error('Usuario Ya Registrado')
                res.status(409).json({ error : error.message })
            }

            const user =  new UserModel( req.body )

            user.password = await hasPassword( req.body.password )

            // añadimos el token al usuario
            const token = new tokenModels
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email : user.email,
                name : user.name,
                token : token.token
            })

            await Promise.allSettled([ token.save() , user.save() ])

            res.send("Usuario creado Correctamente")
            
        } catch (error) {

            res.status(404).json({error : "Hubo un error al crear el usuario"})
            
        }
    }

    public static async getUser () { 
        console.log("el usuario es...mongondo")
    }

}
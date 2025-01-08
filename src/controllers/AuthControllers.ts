import { Request , Response } from "express"
import { UserModel } from "../models/UserModels"
import { checkPassword, hasPassword } from "../utils/auth"
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

    public static async confirmAccount( req : Request , res : Response ) { 

        try {

            const { token } = req.body
        
            const tokenExists = await tokenModels.findOne( { token : token } )
    
            if( !tokenExists ) { 
                const error = new Error("Token no valido")
                res.status(401).json({ error : error.message })
                return 
            }
            
            const userExist = await UserModel.findById( tokenExists.user )
            userExist.confirmed = true
    
            await Promise.allSettled( [ userExist.save() , tokenExists.deleteOne() ] )
    
            res.send('Cuenta Confirmada correctamente ')
            
        } catch (error) {

            res.status(500).json({ error : 'Hubo un Error' })
        
        }

    }

    public static async login( req : Request , res : Response ) { 

        try {

            const { email , password } = req.body 

            const userExist = await UserModel.findOne( { email : email } )
    
            if( !userExist ) { 
                const error = new Error("Usuario no valido")
                res.status(401).json({ error : error.message })
                return
            }

            if( !userExist.confirmed ) { 

                const token = new tokenModels()
                token.token = generateToken()
                token.user = userExist.id

                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email : userExist.email,
                    name : userExist.name,
                    token : token.token
                })

                const error = new Error("Usuario no Confirmado, Email de confirmacion enviado")
                res.status(401).json({ error : error.message})
                return

            }

            const confirmedPassword = checkPassword( password , userExist.password)

            if(!confirmedPassword){
                const error = new Error("Contraseña incorrecta")
                res.status(401).json({ error : error.message})
            }


    
            
        } catch (error) {

            res.status(500).json({ error : "Hubo un error"})

        }

    }

}
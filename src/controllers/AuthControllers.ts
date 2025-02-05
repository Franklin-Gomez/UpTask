import { Request , Response } from "express"
import { UserModel } from "../models/UserModels"
import { checkPassword, hasPassword } from "../utils/auth"
import { tokenModels } from "../models/TokenModels"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/AuthEmail"
import { Model } from "mongoose"
import { generateJWT } from "../utils/jwt"

export class AuthControllers {

    static async createUser( req : Request , res : Response) {

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

    static async confirmAccount( req : Request , res : Response ) { 

        try {

            const { token } = req.body
        
            const tokenExists = await tokenModels.findOne( { token : token } )
    
            if( !tokenExists ) { 
                const error = new Error("Token no valido")
                res.status(401).json({ error : error.message })
                return 
            }
            
            const userExist = await UserModel.findById( tokenExists.user )

            if( !userExist ) { 
                const error = new Error("Usuario no valido")
                res.status(401).json({ error : error.message })
                return 
            }

            userExist.confirmed = true
    
            await Promise.allSettled( [ userExist.save() , tokenExists.deleteOne() ] )
    
            res.send('Cuenta Confirmada correctamente ')
            
        } catch (error) {

            res.status(500).json({ error : 'Hubo un Error' })
        
        }

    }

    static async login( req: Request , res : Response ) : Promise<any> { 

        try {

            const { email , password } = req.body 

            const userExist = await UserModel.findOne( { email : email } )


            if( !userExist ) { 

                const error = new Error('Usuario no valido')
                res.status(404).json({ error : error.message })   
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

            }

            const confirmedPassword = checkPassword( password , userExist.password)

            if(!confirmedPassword){
                const error = new Error("Contraseña incorrecta")
                res.status(401).json({ error : error.message})
                return
            }
            
            const token = generateJWT({ id : userExist.id })
            
            res.send( token )

            
        } catch (error) {

            res.status(500).json({ error : "Hubo un error"})

        }

    }


    static forgotPassword  = async ( req :  Request  , res : Response ) => { 

        try {
            
            const { email } = req.body

            const userExist = await UserModel.findOne({ email  : email })

            if( !userExist ) { 
                const error = new Error("Usuario no valido")
                res.status(404).json({ error : error.message })
                return
            }
            
            const token = new tokenModels()
            token.user = userExist.id
            token.token = generateToken()

            AuthEmail.sendPasswordResetToken({
                email : email,
                name : userExist.name,
                token : token.token
            })

            await token.save()

            res.status(200).send("Revisa tu Correo Electronico")

        } catch (error) {

            res.status(500).json({ error : "Hubo un error"})

        }

    }

    static validateToken = async ( req : Request , res : Response ) => { 

        try {

            const { token }  = req.body

            const tokenInfo = await tokenModels.findOne({ token : token })

            if( !tokenInfo ) { 
                const error = new Error("Token no valido")
                res.status(404).json({ error : error.message })
                return
            }

            res.send("Token valido , Define tu nueva Password")

        } catch (error) {
            
            res.status(500).json({ error : "No se pudo Validar Token"})

        }
    }

    static updatePasswordWithToken = async ( req : Request , res : Response ) => { 

        try {

            const { token } = req.params

            const tokenExists = await tokenModels.findOne({ token : token })

            if( !tokenExists ) {
                const error = new Error("Token Expirado")
                res.status(404).json({ error : error.message })
                return
            }

            const userExist = await UserModel.findById( tokenExists.user )

            if( !userExist ) { 
                const error = new Error("Usuario no Encontrado")
                res.status(404).json({ error : error.message })
                return
            }

            const { password , password_confirmation } = req.body

            if( password != password_confirmation ) { 
                const error = new Error("Contraseñas no coinciden")
                res.status(404).json({ error : error.message })
                return
            }

            userExist.password = await hasPassword( password )

            await userExist.save()
            await tokenExists.deleteOne()

            res.status(200).json("Contraseña creada Correctamente")
            
        } catch (error) {
            
            res.status(500).json({ error : "Hubo un error"})

        }

    }



}
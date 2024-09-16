import { Request , Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../email/AuthEmail";

export class AuthController { 
    static createAccount = async ( req : Request  , res  : Response ) => { 
        try {

            // prevenir duplicados 
            const userExists = await User.findOne(  {email : req.body.email} )
            
            if( userExists) { 
                const error = new Error("El Usuario ya esta registrado")
                return res.status(409).json({ error : error.message })
            }
            
            // crear nuevo usuario
            const user = new User( req.body )

            // Hash password
            user.password = await hashPassword(req.body.password)

            // generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar email
            AuthEmail.sendConfirmationEmail( { 
                email : user.email, 
                name : user.name,
                token : token.token
            })

            await Promise.allSettled([ user.save() , token.save()])

            res.send('Cuenta creada, revisa tu email para confirmarla')

        } catch (error) {
            res.status(400).json({error : 'Hubo un error' })
        }
    }

    static confirmAccount = async ( req : Request , res : Response ) => { 
        try {
            
            const { token } = req.body

            // buscando en la db
            const tokenExist = await Token.findOne( { token } )

            // en caso que no exista token 
            if( !tokenExist ) { 
                const error = new Error('Token no valido')
                return res.status(404).json({ error : error.message })
            }

            const user = await User.findById( tokenExist.user )
            user.confirmed = true // cambiamos el confirmed
            


            await Promise.allSettled([ user.save() , tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente ')

        } catch (error) {

            res.status(500).json({error : 'Hubo un error' })

        }
    }

    static login = async ( req : Request , res : Response ) => { 
        try {
            
            // comprobar si el usuario existe
            const { email , password } = req.body 
            const user = await User.findOne({ email })

            if(!user){
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error : error.message })
            }

            // comprobar si esta confirmado 
            if(!user.confirmed){

                //mandamos un token nuevamente
                const token = new Token()
                token.token = generateToken()
                token.user = user.id

                await token.save()

                // enviar email
                AuthEmail.sendConfirmationEmail( { 
                    email : user.email, 
                    name : user.name,
                    token : token.token
                })


                const error = new Error('Usuario no Confirmado , hemos enviado un token a tu correo electronico')
                return res.status(401).json({ error : error.message })
            }

            // Revisar password 
            const isPasswordCorrect = await checkPassword( password , user.password )

            if( !isPasswordCorrect ) { 
                
                const error = new Error('Password es Incorrecto')
                return res.status(401).json({ error : error.message })

            }

            console.log( 'iniciar session ')

        } catch (error) {

            res.status(500).json({error : 'Hubo un error' })

        }
    }

    static requestConfirmationCode = async ( req : Request  , res  : Response ) => { 
        try {

            // prevenir duplicados 
            const user = await User.findOne(  { email : req.body.email} )
            
            if( !user) { 
                const error = new Error("El Usuario no esta registrado")
                return res.status(404).json({ error : error.message })
            }

            if(user.confirmed) { 
                const error = new Error("El Usuario Ya este Confirmado")
                return res.status(403).json({ error : error.message })
            }

            // generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar email
            AuthEmail.sendConfirmationEmail( { 
                email : user.email, 
                name : user.name,
                token : token.token
            })

            await token.save()

            res.send('Token enviado, revisa tu email para confirmarla')

        } catch (error) {
            res.status(400).json({error : 'Hubo un error' })
        }
    }

    static forgotPassword = async ( req : Request  , res  : Response ) => { 
        try {

            // prevenir duplicados 
            const user = await User.findOne(  { email : req.body.email} )
            
            if( !user) { 
                const error = new Error("El Usuario no esta registrado")
                return res.status(404).json({ error : error.message })
            }

            // generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // enviar email
            AuthEmail.sendPasswordResetToken( { 
                email : user.email, 
                name : user.name,
                token : token.token
            })

            res.send('Token enviado, revisa las Instrucciones en tu email')

        } catch (error) {
            res.status(400).json({error : 'Hubo un error' })
        }
    }

    static validateToken = async ( req : Request , res : Response ) => { 
        try {
            
            const { token } = req.body

            // buscando en la db
            const tokenExist = await Token.findOne( { token } )

            // en caso que no exista token 
            if( !tokenExist ) { 
                const error = new Error('Token no valido')
                return res.status(404).json({ error : error.message })
            }

            res.send('Token Valido , Define tu nueva Password ')

        } catch (error) {

            res.status(500).json({error : 'Hubo un error' })

        }
    }
}
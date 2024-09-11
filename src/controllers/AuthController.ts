import { Request , Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transport } from "../config/nodemailer";

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
            await transport.sendMail({
                from: 'UpTask <admin@uptask.com>',
                to : user.email,
                subject : 'UpTask - Confirma tu cuenta',
                text : 'UpTask - Confirma tu cuenta',
                html : '<p> Probando e-mail </p>'
            })

            await Promise.allSettled([ user.save() , token.save()])

            res.send('Cuenta creada, revisa tu email para confirmarla')

        } catch (error) {
            res.status(400).json({error : 'Hubo un error' })
        }
    }
}
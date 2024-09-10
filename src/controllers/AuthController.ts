import { Request , Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt'
import { hashPassword } from "../utils/auth";

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

            await user.save()

            res.send('Cuenta creada, revisa tu email para confirmarla')

        } catch (error) {
            res.status(400).json({error : 'Hubo un error' })
        }
    }
}
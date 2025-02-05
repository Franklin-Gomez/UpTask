import { NextFunction , Request , Response } from "express"
import { UserModel, UserType } from "../models/UserModels"
import jwt from "jsonwebtoken"

declare global { 
    namespace Express { 
        interface Request { 
            user? : UserType
        }
    }
}

export const authenticate = async ( req : Request , res : Response , next : NextFunction ) => { 

    const bearer = req.headers.authorization

    if(!bearer) { 
        const error =  new Error('No Autorizado')
        res.status(401).json({ error : error.message})
        return
    }

    // bearer 'token', vienen dos terminimos pero solo nos intera 'token'
    const token = bearer.split(' ')[1]
    // otra forma de quitar el bearer
    //const [ , token ] = bearer.split('')

    try {

        const decode = jwt.verify( token , process.env.JWT_SECRET )

        if( typeof decode == 'object' && decode.id ) {

            const user = await UserModel.findById(decode.id)

            if( user ) { 
                
                req.user = user 

            } else { 

                res.status(500).json( { error : "Token no valido"} )

            }

        }
        
    } catch (error) {

        res.status(500).json({ error : "Token no valido"})

    }
    
    next()

}
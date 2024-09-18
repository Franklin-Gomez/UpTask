import { Request , Response  , NextFunction } from "express"
import jwt  from "jsonwebtoken"
import User, { IUser } from "../models/User"

// escribir en el req una nueva propiedad
declare global { 
    namespace Express { 
        interface Request { 
            user? : IUser
        }
    }
}

export const authenticate = async ( req : Request , res : Response  ,next : NextFunction) => { 

    const bearer = req.headers.authorization

    if(!bearer) { 
        const error =  new Error('No Autorizado')
        return res.status(401).json({ error : error.message})
    }

    // bearer 'token', vienen dos terminimos pero solo nos intera 'token'
    const token = bearer.split(' ')[1]

    // otra forma de quitar el bearer
    //const [ , token ] = bearer.split('')

    try {

        // verificamos que el token sea valido
        const decode = jwt.verify( token , process.env.JWT_SECRET )

        // verificamos que el usuario exista
        if( typeof decode == 'object' && decode.id ){

            const user = await User.findById(decode.id).select('_id name email')

            if( user ) {
                req.user = user
            } else { 
                res.status(500).json({ error : 'Token No Valido '})
            }

        }

    } catch (error) {
        return res.status(500).json({ error : 'Token no valido'})
    }

    next()
}
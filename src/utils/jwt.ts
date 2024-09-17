import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type userPayload = { 
    id : Types.ObjectId
}

export const generateJWT = (  payload : userPayload ) => { 
    // payload -> lo que vamos a meter al token
    // secretOrPrivateKey -> va en las variables de entorno, para generar y verificar el token
    // argumentos -> expiresIn uno de tantos pero es muy importante

    const token = jwt.sign( payload , process.env.JWT_SECRET , { 
        expiresIn : '6min'
    })

    return token
    
}
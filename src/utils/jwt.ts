import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type userPayload = { 
    id : Types.ObjectId
}

export const generateJWT = ( payload : userPayload ) => { 
    // payload -> lo que vamos a meter al token
    // secretOrPrivateKey -> va en las variables de entorno, para generar y verificar el token
    // argumentos -> expiresIn uno de tantos pero es muy importante

    const token = jwt.sign( // sing es para crear
        payload ,  // la informacion del usuario
        process.env.JWT_SECRET , // palabra para seguridad
        { expiresIn : '180d'} // en que momento se invalidara el token
    )

    return token
    
}
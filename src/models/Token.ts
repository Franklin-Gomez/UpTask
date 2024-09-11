import mongoose , { Schema , Document, Types} from "mongoose";

export interface Itoken extends Document { 
    token : string
    user : Types.ObjectId // informacion del usuario
    createdAt : Date
}

const tokenSchema : Schema = new Schema ({ 
    token : { 
        type : String,
        required : true
    },
    user : { 
        type : Types.ObjectId,
        ref : 'User' // donde encontrara la informacion
    },
    createdAt : { 
        type : Date,
        default :  Date.now(), // genera le fecha en automatico una vez se crea el objeto
        expires : '10m' // despues de un 1 se elimina en automatico
    },
})

const Token = mongoose.model<Itoken>('Token' , tokenSchema )
export default Token

import mongoose, { Types } from "mongoose"

export type TokenType = { 
    token : string 
    user : Types.ObjectId
    createdAt : Date
}


const tokenSchema  = new mongoose.Schema ({ 
 
    token : { 
        type : String , 
        required : true
    },

    user : { 
        type : Types.ObjectId,
        ref : 'User'
    },

    createdAt : { 
        type : String,
        default : Date.now(),
        expires : '10m'
    }

})

export const tokenModels = mongoose.model<TokenType>('Token' , tokenSchema)
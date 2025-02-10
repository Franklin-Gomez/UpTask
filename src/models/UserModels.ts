import { Schema } from "express-validator";
import mongoose, { Document }  from "mongoose";

export type UserType = Document & { 
    email : string
    password : string
    name : string
    confirmed : boolean
}


const UserSchema : mongoose.Schema = new mongoose.Schema({ 

    email : {
        type : String , 
        required : true,
        lowercase : true,
        unique : true
    },

    password : { 
        type : String,
        required : true
    },

    name : {
        type : String,
        required : true,
        trim : true
    } ,

    confirmed : {
        type : Boolean,
        default : false
    }

})

export const UserModel = mongoose.model<UserType>('User' , UserSchema)
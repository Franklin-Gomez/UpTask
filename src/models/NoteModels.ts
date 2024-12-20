import mongoose, { Document, Types } from "mongoose";


export type noteSchemaType = Document & { 
    content : string,
    createBy : string,
    task : Types.ObjectId
}

const noteSchema   = new mongoose.Schema({

    content : {
        type : String ,
        required : true 
    },

    createdBy : { 
        type : String,
        default : 'user'
    },

    task : { 
        type : Types.ObjectId,
        ref : 'Task',
        required : true
    }

}, { timestamps : true } )

export const NoteModel = mongoose.model('Note' , noteSchema)
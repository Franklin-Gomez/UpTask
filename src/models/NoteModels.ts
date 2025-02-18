import mongoose, { Document, Types } from "mongoose";


export type noteSchemaType = Document & { 
    content : string,
    createdBy : Types.ObjectId,
    task : Types.ObjectId
}

const noteSchema  = new mongoose.Schema({

    content : {
        type : String ,
        required : true 
    },

    createdBy : { 
        type : Types.ObjectId,
        ref : 'User',
        required : true
    },

    task : { 
        type : Types.ObjectId,
        ref : 'Task',
        required : true
    }

}, { timestamps : true } )

export const NoteModel = mongoose.model<noteSchemaType>('Note' , noteSchema)
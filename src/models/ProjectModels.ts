import mongoose, { Document } from "mongoose";

export type projectType = Document & { 
    projectName : string
    clientName : string
    description : string
}

const projectSchema = new mongoose.Schema({

    projectName : { 
        type : String,
        required : true,
        trim : true
    },

    clientName : { 
        type : String,
        required : true,
        unique : true,
        trim : true
    }, 

    description : { 
        type : String,
        required : true,
        trim : true
    }

})

export const ProjectModel = mongoose.model<projectType>('Project' , projectSchema)
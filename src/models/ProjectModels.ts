import mongoose, { Document, PopulatedDoc, PopulateOption, Types } from "mongoose";
import { TaskType } from "./TaskModels";

export type projectType = Document & { 
    projectName : string
    clientName : string
    description : string
    tasks : PopulatedDoc<TaskType & Document>[]
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
    },

    tasks :  [
        {
            type : Types.ObjectId,
            ref : 'Task'
        }
    ]
    

})

export const ProjectModel = mongoose.model<projectType>('Project' , projectSchema)
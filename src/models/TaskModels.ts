import mongoose, { Document , Types } from "mongoose";

export type TaskType = Document & { 
    descripcion : string
    projectId : Types.ObjectId
    name : string
}

const TaskSchema = new mongoose.Schema({

    name : { 
        type : String,
        required : true,
        trim : true
    },

    description : { 
        type : String,
        required : true,
        trim : true
    }, 

    projectId : { 
        type : Types.ObjectId,
        ref : 'Project'
    },

    status : { 
        type : String,
        enum : 'pending',
        default : 'pending'
    }

} , {timestamps : true })

export const TaskModel = mongoose.model<TaskType>('Task' , TaskSchema)
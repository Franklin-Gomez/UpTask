import mongoose, { Document , Types } from "mongoose";

// diccionario
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const // as const == permite solo lectura, no se puede modificiar

export type TaskStatus = typeof taskStatus[ keyof typeof taskStatus ]


export type TaskType = Document & { 
    descripcion : string
    projectId : Types.ObjectId
    name : string
    status : TaskStatus
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
        enum : Object.values(taskStatus), // pasarle los valores, que solo estos aceptara
        default : 'pending'
    }

} , {timestamps : true })

export const TaskModel = mongoose.model<TaskType>('Task' , TaskSchema)
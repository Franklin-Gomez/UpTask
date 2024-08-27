import mongoose , { Schema , Document , Types} from "mongoose";


export type TaskType = Document & { 
    name : string
    description : string
    project: Types.ObjectId //<-- type  para la tarea relacionada
}

export const TaskSchema : Schema = new Schema ({
    name : { 
        type : String,
        trim : true,
        required : true
    },

    description : { 
        type : String,
        trim : true,
        required : true
    },

    project : { //<--- referencia del projecto relacionado
        type : Types.ObjectId,
        ref : 'Project' // <-- donde estara la infomracion del project
    }
}, {timestamps : true })

const Task = mongoose.model<TaskType>('Task' , TaskSchema)
export default Task

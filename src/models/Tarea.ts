import mongoose , { Schema , Document , Types} from "mongoose";

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
    name : string
    description : string
    project: Types.ObjectId //<-- type  para la tarea relacionada
    status : TaskStatus
    completedBy : {
        user : Types.ObjectId,
        status : TaskStatus
    }[]
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
    },

    status : { 
        type : String,
        enum : Object.values( taskStatus ),
        default : taskStatus.PENDING
    },

    completedBy : [
        {

            user : { 
                type : Types.ObjectId, // id del usuario
                ref : 'User',
                default : null
            },

            status : { 
                type : String,
                enum : Object.values( taskStatus ),
                default : taskStatus.PENDING
            }
        }
    ]

}, {timestamps : true })

const Task = mongoose.model<TaskType>('Task' , TaskSchema)
export default Task

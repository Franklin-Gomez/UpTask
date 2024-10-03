import mongoose , { Schema , Document , Types} from "mongoose";
import Note from "./Note";

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
    notes : Types.ObjectId[]
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
    ],

    notes : [
        {
            type : Types.ObjectId,
            ref : Note
        }
    ]

}, {timestamps : true })

// Middleware
// se activa antes o despues de ejecutar el 'deleteOne'
TaskSchema.pre('deleteOne' , { document : true } , async function () { 
    // nos muestra el objeto eliminando , el valor de this cambia dependiendo si  document , query  es true o false 
    // console.log( this._id  ) // id de la tarea eliminada

    const taskId = this._id // capturamos el id de la tarea eliminada 
    if(!taskId) return 
    await Note.deleteMany( { task : taskId }) // eliminamos la nota que tenga de referencia esta tarea
    
})

const Task = mongoose.model<TaskType>('Task' , TaskSchema)
export default Task

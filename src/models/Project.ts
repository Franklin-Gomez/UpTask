import mongoose , { Schema , Document, PopulatedDoc , Types} from "mongoose";
import Task, { TaskType } from "./Tarea";
import { IUser } from "./User";
import Note from "./Note";

// esto es typeScript
export type ProjectType = Document & { // Heredar todo el typado de document 
    projectName : string
    clientName : string
    description : string
    tasks : PopulatedDoc<TaskType & Document>[] //<--nos traemos la informacion de la tarea
    manager : PopulatedDoc<IUser & Document> // <-- quien creo el proyecto
    team: PopulatedDoc<IUser & Document>[] // equipo asignado al proyecto
}

// esto es de mongoose
const ProjectSchema : Schema = new Schema ({
    projectName : {
        type : String,
        required : true,
        trim  : true // elimina los espacios 
    },
    clientName : { 
        type : String,
        required : true,
        trim  : true,
        unique : true
    } ,
    description : {
        type : String,
        required : true,
        trim  : true
    },
    tasks : [
        {
            type : Types.ObjectId,
            ref : 'Task' // referencia - datos
        }
    ],
    manager : {
        type : Types.ObjectId,
        ref : 'User' // referencia - datos 
    },
    team : [
        {
            type : Types.ObjectId,
            ref : 'User' // referencia - datos 
        }
    ]

}, { timestamps : true} )

// Middleware
// se activa antes o despues de ejecutar el 'deleteOne'
ProjectSchema.pre('deleteOne' , { document : true } , async function () { 
    
    const ProjectId = this._id 
    if(!ProjectId) return 

    // todas las tareas que pertenescan a este proyecto
    const tasks = await Task.find({ project : ProjectId })

    //recorremos eliminamos las notas de esta tarea
    for( const task of tasks ) { 
        await Note.deleteMany({ task :  task.id })
    }


    await Task.deleteMany( { project : ProjectId })
})

//añádiendo del modelo a mongose
const Project = mongoose.model<ProjectType>('Project' , ProjectSchema)
export default Project

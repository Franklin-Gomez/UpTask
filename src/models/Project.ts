import mongoose , { Schema , Document, PopulatedDoc , Types} from "mongoose";
import { TaskType } from "./Tarea";

// esto es typeScript
export type ProjectType = Document & { // Heredar todo el typado de document 
    projectName : string
    clientName : string
    description : string
    tasks : PopulatedDoc<TaskType & Document>[] //<--nos traemos la informacion de la tarea
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
            ref : 'Task'
        }
    ]
}, { timestamps : true} )

//añádiendo del modelo a mongose
const Project = mongoose.model<ProjectType>('Project' , ProjectSchema)
export default Project

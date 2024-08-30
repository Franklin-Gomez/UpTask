import { Request , Response , NextFunction } from "express";
import Task , { TaskType } from "../models/Tarea";


// agregamos una nueva propiedad al type de request de express
declare global { 
    namespace Express {
        interface Request { 
            task : TaskType
        }
    }
}

export async function taskExists( req : Request , res : Response , next : NextFunction) { 

    try {
        const { taskId } = req.params

        const task = await Task.findById( taskId )

        if(!task) { 
            const error = new Error('Tarea no encontrado')
            return res.status(404).json({ error : error.message})
        }

        req.task = task

        next()

    } catch (error) {

        console.log( error )

    }
}
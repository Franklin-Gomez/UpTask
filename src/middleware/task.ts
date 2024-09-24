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

export const taskBelongsToProject = ( req : Request , res : Response , next : NextFunction ) => { 

    // si la tarea no pertenece al proyecto
    if( req.task.project.toString() !== req.project.id.toString() ) { 
        const error = new Error('La tarea no pertenece a este proyecto')
        return res.status(400).json({ error : error.message})
    }

    next()

}

export const hasAuthorization = ( req : Request , res : Response , next : NextFunction ) => { 

    // si el usuario que esta realizando estas acciones no es el manager
    if( req.user.id.toString() !== req.project.manager.toString()) { 
        const error = new Error('La tarea no pertenece a este proyecto')
        return res.status(400).json({ error : error.message})
    }

    next()

}
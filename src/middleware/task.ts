import { ProjectModel } from "../models/ProjectModels"
import { Request , Response , NextFunction } from "express"
import { TaskModel, TaskType } from "../models/TaskModels"

declare global { 
    namespace Express { 
        interface Request { 
            task : TaskType
        }
    }
}

export const  taskExist = async ( req : Request , res : Response , next : NextFunction) => { 
    try {

        const taskId = req.params.taskId

        const task = await TaskModel.findById( taskId )

        if( !task ) { 

            const error = new Error('Tarea no encontrado')
            return res.status(404).json({ error : error.message })

        }

        req.task = task 

        next()
        
    } catch (error) {

        res.status(404).send({ error : error.message})

    }
}

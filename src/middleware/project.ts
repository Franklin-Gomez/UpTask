import { Request , Response , NextFunction } from "express";
import Project, { ProjectType } from "../models/Project";


// agregamos una nueva propiedad al type de request de express
declare global { 
    namespace Express {
        interface Request { 
            project : ProjectType
        }
    }
}

export async function validateProjectExists( req : Request , res : Response , next : NextFunction) { 

    try {
        const { projectId } = req.params

        const project = await Project.findById( projectId )

        if(!project) { 
            const error = new Error('proyecto no encontrado')
            return res.status(404).json({ error : error.message})
        }

        req.project = project

        next()

    } catch (error) {

        console.log( error )

    }
}
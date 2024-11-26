import { ProjectModel, projectType } from "../models/ProjectModels"
import { Request , Response , NextFunction } from "express"

declare global { 
    namespace Express { 
        interface Request { 
            project : projectType
        }
    }
}

export const  projectExist = async ( req : Request , res : Response , next : NextFunction) => { 
    try {

        console.log( req.params )

        const projectId = req.params.projectId

        const project = await ProjectModel.findById( projectId )

        if( !project ) { 

            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({ error : error.message })

        }

        req.project = project 

        next()
        
    } catch (error) {

        res.status(404).send({ error : error.message})

    }
}

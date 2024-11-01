import { Request , Response } from "express"

export class ProjectControllers {

    public static createProject( req : Request, res : Response) { 
        console.log( req.body)
    }

    public static getAllProject( req : Request, res : Response) { 
        res.send('desde get all project')
    }

    public static updateProject( req : Request, res : Response) { 
        res.send('desde editar Project')
    }

    public static deleteProject ( req : Request , res : Response ){
        res.send('desde delete Project')
    }
}
import { Request , Response } from "express"

export class ProjectControllers {

    public static getAllProject( req : Request, res : Response) { 
        res.send('desde get all project')
    }

    
    public static createProject( req : Request, res : Response) { 
        res.send('desde crear Project')
    }
}
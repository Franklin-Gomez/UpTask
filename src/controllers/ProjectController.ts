import { Request , Response } from "express"

// static ? = no requiere ser instanciado
export class ProjectController { 
    static getAllProjects = async ( req : Request , res : Response) => { 
        res.send('todos los proyectos')
    }
}
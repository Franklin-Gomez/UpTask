import { Request , Response } from "express"
import Project from "../models/Project"

// static ? = no requiere ser instanciado
export class ProjectController { 
    static createProject = async ( req : Request , res : Response) => { 
        
        const data = new Project(req.body)

        try {
            
            await data.save() // Project.create(req.body)
            res.send('proyecto creado correctamente')

        } catch (error) {
            console.log( error )
        }
    }

    static getAllProjects = async ( req : Request , res : Response) => { 
        try {

            const data =  await Project.find({})
            
            res.json( data)


        } catch (error) {
            console.log( error )
        }
    }

    static getOneProjects = async ( req : Request , res : Response ) => { 
        res.send('un proyecto papu')
    }
}
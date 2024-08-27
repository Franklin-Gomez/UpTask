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
        
        try {

            const id = req.params.id
    
            const data = await Project.findById( id )// buscamos el registro
    
            if(!data){
                const error = new Error('proyecto no encontrado')
                return res.status(404).json( {error : error.message})
            }
    
            // devolvemos al front
            res.json( data )
            
        } catch (error) {

            console.log( error )            
            
        }
    }
}
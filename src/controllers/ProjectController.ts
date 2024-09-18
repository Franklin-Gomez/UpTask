import { Request , Response } from "express"
import Project from "../models/Project"

// static ? = no requiere ser instanciado
export class ProjectController { 
    static createProject = async ( req : Request , res : Response) => { 
        
        const data = new Project(req.body)

        // Asignar un manager
        data.manager = req.user.id

        try {
            
            await data.save() // Project.create(req.body)
            res.send('proyecto creado correctamente')

        } catch (error) {
            console.log( error )
        }
    }

    static getAllProjects = async ( req : Request , res : Response) => { 
        try {

            const data =  await Project.find({
                //filtrar por cierta condicion
                $or : [
                    { manager : { $in : req.user.id }}
                ]
            })
            
            res.json( data)


        } catch (error) {
            console.log( error )
        }
    }

    static getOneProjects = async ( req : Request , res : Response ) => { 
        
        try {

            const id = req.params.id
    
            const data = await Project.findById( id ).populate('tasks')
    
            if(!data){
                const error = new Error('proyecto no encontrado')
                return res.status(404).json( {error : error.message})
            }

            if( data.manager.toString() !== req.user.id.toString() ) { 
                const error = new Error('Accion no valida')
                return res.status(404).json( {error : error.message})
            }
    
            // devolvemos al front
            res.json( data )
            
        } catch (error) {

            console.log( error )            

        }
    }

    static updateProject  = async ( req : Request , res : Response) => { 
        
        try {
            
            const id = req.params.id

            const data =  await Project.findById( id )

            if(!data) { 
                const error = new Error('proyecto no encontrado')
                return res.status(404).json({ error : error.message})
            }

            if( data.manager.toString() !== req.user.id.toString() ) { 
                const error = new Error('Solo el Manager puede Actualizar el proyecto')
                return res.status(404).json( {error : error.message})
            }

            data.clientName = req.body.clientName
            data.projectName = req.body.projectName
            data.description = req.body.description

            await data.save()


            //devolvemos al front
            res.send('Proyecto Actualizado')
            
        } catch (error) {
            
            console.log( error )

        }

    }

    static deleteProject = async ( req : Request , res : Response ) =>  {

        try {
            
            const id  = req.params.id

            const data = await Project.findById(id)
            
            if(!data) { 
                const error = new Error('proyecto no encontrado')
                return res.status(404).json({ error : error.message})
            }

            if( data.manager.toString() !== req.user.id.toString() ) { 
                const error = new Error('Solo el Manager puede eliminar un Proyecto')
                return res.status(404).json( {error : error.message})
            }

            /*
                COMPROBACIOENS ADICIONALES DE PERMISOS DEL USUARIO
            */

            await data.deleteOne()

            res.send('Proyect eliminado')


        } catch (error) {

            console.log( error)

        }
    }
}
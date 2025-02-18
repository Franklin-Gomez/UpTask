import { Request , Response } from "express"
import { ProjectModel } from "../models/ProjectModels"
import { AuthControllers } from "./AuthControllers"
import { UserModel } from "../models/UserModels"

export class ProjectControllers {

    public static async createProject( req : Request, res : Response) { 
    
        const project =  new ProjectModel( req.body)
        
        project.manager = req.user.id
        
        try {

            console.log( project )

            await project.save()

            res.send('projecto creado correctamente')
            
        } catch (error) {
            
            res.send('error al crear el projecto')
        }

    }

    public static async getAllProject( req : Request, res : Response) {

        try {
            
            const projects = await ProjectModel.find({
                $or : [
                    { manager : { $in : req.user.id }},
                    { team : { $in : req.user.id }}

                ]
            }
            ).populate("tasks")
                
            res.json(projects)

        } catch (error) {

            console.log( error )

        }

    }

    public static async getOneProject( req : Request , res : Response) { 

        const id = req.params.projectId

        try {
            
            const project = await ProjectModel.findById( id ).populate('tasks')

            if(!project){
                const error = new Error('proyecto no encontrado')
                res.status(404).json( {error : error.message})
                return;
            }

            // // solo el manager puede ver los detalles del proyecto
            // if( project.manager.toString() !== req.user.id.toString() ) { 
            //     const error = new Error('Accion no valida')
            //     res.status(404).json( {error : error.message})
            //     return;
            // }

            res.json( project )

        } catch (error) {

            console.log( error )

        }

    }

    public static async updateProject( req : Request, res : Response) { 
            
        // const id = req.params.projectId

        // const newData = req.body
        
        // const project = await ProjectModel.findByIdAndUpdate( id , newData )

        try {

           const id = req.params.projectId

           const project =  await ProjectModel.findById( id )

           if(!project) { 
               const error = new Error('proyecto no encontrado')
               res.status(404).json({ error : error.message})
               return
            }

           if( project.manager.toString() !== req.user.id.toString() ) { 
                const error = new Error('Solo el Manager puede Actualizar el proyecto')
                res.status(404).json( {error : error.message})
                return
           }

            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description

            await req.project.save()

            //devolvemos al front
            //res.send('Proyecto Actualizado')
            res.json( req.project )

        } catch (error) {

            console.log( error )

        }
    }

    public static async deleteProject ( req : Request , res : Response ){

        const id = req.params.projectId

        try {
            
            // await ProjectModel.findByIdAndDelete( id )

            // res.send( 'Eliminado Correctamente')

            const data = await ProjectModel.findById(id)
            
            if(!data) { 
                const error = new Error('proyecto no encontrado')
                res.status(404).json({ error : error.message})
                return
            }

            if( data.manager.toString() !== req.user.id.toString() ) { 
                const error = new Error('Solo el Manager puede eliminar un Proyecto')
                res.status(404).json( {error : error.message})
                return 
            }

            await req.project.deleteOne()

            res.send('Proyect eliminado')

        } catch (error) {

            console.log( error )

        }
    }

    public static async findMemberByEmail ( req : Request , res : Response ) { 

        const email = req.body.email

        const UserExist = await UserModel.findOne({ email : email }).select('_id email name')

        if( !UserExist ) { 
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error : error.message })
            return
        }

        res.json( UserExist )

    }

    public static async addMemberById ( req : Request , res : Response ) { 

        const id = req.body.id

        const UserExist = await UserModel.findById( id ).select('_id')

        if( !UserExist ) { 
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error : error.message })
            return
        }

        const validacion =  req.project.team.some( member => member._id.toString() == UserExist._id.toString() )

        if( validacion ) { 
            const error = new Error("usuario ya registrado")
            res.status(404).json({ error : error.message})
            return
        }

        req.project.team.push( id.toString() )

        await req.project.save()

        res.send( 'Usuario Agregado correctamente' )

    }

    public static async removeMemberById ( req : Request , res : Response ) { 

        const id = req.params.userId

        const UserExist = await UserModel.findById( id ).select('_id')

        if( !UserExist ) { 
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error : error.message })
            return
        }

        const newArray = req.project.team.filter(member => member._id.toString() != UserExist.id.toString() ) 

        req.project.team = newArray

        await req.project.save()

        res.send( 'Miembro Eliminado correctamente' )

    }

    public static async getProjectsTeam ( req : Request , res : Response ) { 

        const project = await ProjectModel.findById( req.project.id ).populate({
            path : 'team',
            select : 'id email name'
        })

        res.json( project.team )
    }

}
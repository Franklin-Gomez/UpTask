import { Request , Response } from "express"
import { ProjectModel } from "../models/ProjectModels"

export class ProjectControllers {

    public static async createProject( req : Request, res : Response) { 

        try {

            const project =  new ProjectModel( req.body)

            await project.save()

            res.send('projecto creado correctamente')
            
        } catch (error) {
            
            res.send('error al crear el projecto')
        }

    }

    public static async getAllProject( req : Request, res : Response) { 

        try {
            
            const projects = await ProjectModel.find().populate("tasks")

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

            res.json( project )

        } catch (error) {

            console.log( error )

        }

    }

    public static async updateProject( req : Request, res : Response) { 

        const id = req.params.projectId

        const newData = req.body

        try {
            
            const project = await ProjectModel.findByIdAndUpdate( id , newData )

            res.json( project )

        } catch (error) {

            console.log( error )

        }
    }

    public static async deleteProject ( req : Request , res : Response ){

        const id = req.params.projectId

        try {
            
            await ProjectModel.findByIdAndDelete( id )

            res.send( 'Eliminado Correctamente')

        } catch (error) {

            console.log( error )

        }
    }
}
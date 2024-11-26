import { Request , Response } from "express"
import { TaskModel } from "../models/TaskModels"
import { ProjectModel } from "../models/ProjectModels"


export class TaskControllers {

    public static createTask = async (  req : Request ,  res : Response  ) => { 

        try {

            const projectId = req.params.projectId

            const project = await ProjectModel.findById( projectId )

            if( project ) { 
                
                const task = new TaskModel( req.body )

                console.log( req.project )

                const resultado = await task.save()

                res.send("Tarea creada Correctamente")

            }
            
        } catch (error) {

            res.status(404).send({ error : error.message})

        }

    }

    public static getOneTask = async (  req : Request ,  res : Response) => { 
        
        try {

            const projectId = req.params.projectId

            const project = await ProjectModel.findById( projectId )

            if( project ) { 
                
                const taskId = req.params.taskId

                if( !taskId ) { 
                    res.send('ID de tarea no valido')
                    return
                }

                // req.project.tasks = 
        
                // //const task = await TaskModel.findById( taskId )

                // res.json( task )

            } 
            
        } catch (error) {

            res.status(404).send({ error : error.message})

        }

    }

    public static updateTask = async ( req : Request ,  res : Response) => { 
    
    } 

    public static deleteTask = async ( req : Request ,  res : Response) => { 
        res.send('desde borrar tarea')
    }

}
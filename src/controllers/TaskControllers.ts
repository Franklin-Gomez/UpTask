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

                // seteamos el id del proyecto  a la tarea
                task.projectId = req.project.id

                // en nuestro proyecto en memoria guardamos la tarea recien creada
                req.project.tasks.push( task.id )

                // guardamos la tarea y el proyecto que tenemos en memoria
                await Promise.allSettled([task.save() , req.project.save() ])

                res.send("Tarea creada Correctamente")

            }
            
        } catch (error) {

            res.status(404).send({ error : error.message})

        }

    }

    public static getAllTask = async ( req : Request , res : Response) => { 

        try {

            const tasks = await TaskModel.find({ projectId : req.project.id}).populate('projectId')

            res.json( tasks )
    
            
        } catch (error) {

            
            res.status(404).json({error : error.message})

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
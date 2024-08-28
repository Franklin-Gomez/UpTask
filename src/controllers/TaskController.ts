import type { Request , Response } from 'express'
import Task from '../models/Tarea'

export class TaskControllers { 

    static createTasks =  async ( req : Request , res : Response) => { 
        
        try {

            const task = new Task(req.body)
            task.project = req.project.id

            req.project.tasks.push( task.id )

            await Promise.allSettled([task.save() , req.project.save()])
  
            res.send('Tarea Agregada Correctamente')
        
        } catch (error) {

            return res.status(404).json({ error : error.message})
        
        }
    }

    static geProjectTasks = async ( req : Request , res : Response) => { 
        try {
            
            // nos traemos todos los elementos que concuerden cel filter
            const tasks = await Task.find({ project : req.project.id})
            res.json( tasks )


        } catch (error) {
            return res.status(404).json({ error : error.message})
        }
    }
}
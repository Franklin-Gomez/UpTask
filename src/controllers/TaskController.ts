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

            console.log( error  )
        
        }
    }
}
import type { Request , Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Tarea'

export class TaskControllers { 

    static createTasks =  async ( req : Request , res : Response) => { 
        
        try {

            const task = new Task(req.body)
            task.project = req.project.id
            await task.save()

            req.project.tasks.push( task.id )
            await req.project.save()

            res.send('Tarea Agregada Correctamente')
        
        } catch (error) {

            console.log( error  )
        
        }
    }
}
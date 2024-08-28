import type { Request , Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Tarea'

export class TaskControllers { 

    static createTasks =  async ( req : Request , res : Response) => { 
        try {
            
            const { projectId } = req.params

            const project = await Project.findById( projectId )

            if(!project) { 
                const error = new Error('proyecto no encontrado')
                return res.status(404).json({ error : error.message})
            }

            const task = new Task(req.body)
            task.project = project.id
            await task.save()

            project.tasks.push( task.id )
            await project.save()

            res.send('Tarea Agregada Correctamente')
        
        } catch (error) {

            console.log( error  )
        
        }
    }
}
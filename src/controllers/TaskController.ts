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
            const tasks = await Task.find({ project : req.project.id}).populate('project')

            res.json( tasks )


        } catch (error) {
            return res.status(404).json({ error : error.message})
        }
    }
 
    static getTaskById = async ( req : Request , res : Response ) => { 

        try {

            const { taskId } = req.params
            const task = await Task.findById( taskId )

            if(!task) { 
                const error = new Error('tarea no encontrada')
                return res.status(404).json({ error : error.message })
            }

            // si la tarea no pertenece al proyecto
            if( task.project.toString() !== req.project.id ) { 
                const error = new Error('Accio no valida')
                return res.status(400).json({ error : error.message})
            }
            
            res.json(task)


        } catch (error) {

            return res.status(500).json({ error : 'Hubo un error'})

        }
    }

    static updateTask = async ( req : Request , res : Response ) => { 
        try {

            const { taskId } = req.params
            const task = await Task.findByIdAndUpdate( taskId , req.body )

            if(!task) { 
                const error = new Error('tarea no encontrada')
                return res.status(404).json({ error : error.message })
            }

            // si la tarea no pertenece al proyecto
            if( task.project.toString() !== req.project.id ) { 
                const error = new Error('Accio no valida')
                return res.status(400).json({ error : error.message})
            }
            
            res.send('Tarea Actualizada Correctamente')
            
        } catch (error) {
            return res.status(500).json({ error : 'Hubo un error'})
        }
    }

}
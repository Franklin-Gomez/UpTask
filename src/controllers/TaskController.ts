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

            // si la tarea no pertenece al proyecto
            // if( req.task.project.toString() !== req.project.id ) { 
            //     const error = new Error('Accio no valida')
            //     return res.status(400).json({ error : error.message})
            // }

            const task = await Task.findById(req.task.id)
                        .populate({ path : 'completedBy' , select : 'id name email'})
            
            res.json(task)

        } catch (error) {

            return res.status(500).json({ error : 'Hubo un error'})

        }
    }

    static updateTask = async ( req : Request , res : Response ) => { 
        try {

            // si la tarea no pertenece al proyecto
            // if( req.task.project.toString() !== req.project.id ) { 
            //     const error = new Error('Accio no valida')
            //     return res.status(400).json({ error : error.message})
            // }

            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()
            
            res.send('Tarea Actualizada Correctamente')
            
        } catch (error) {
            return res.status(500).json({ error : 'Hubo un error'})
        }
    }

    static deleteTask =  async ( req : Request , res : Response ) => { 
        try {

            // eliminando la referencia que tenemos en project
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString())

            await Promise.allSettled([ req.task.deleteOne() , req.project.save() ])
            
            res.send('Tarea Eliminada Correctamente')
            
        } catch (error) {

            return res.status(500).json({ error : 'Hubo un error'})

        }
    }

    static updateStatus =  async ( req : Request , res : Response ) => { 

        try {

            const { status } = req.body
            
            req.task.status = status

            // historial de cambios
            const data = { 
                user: req.user.id,
                status
            }

            req.task.completedBy.push( data)
            
            await req.task.save()

            res.send('Status actualizada correctamente')


        } catch (error) {

            return res.status(500).json({ error : 'Hubo un error'})

        }
    }

}
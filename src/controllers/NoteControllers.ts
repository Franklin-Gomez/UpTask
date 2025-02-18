import { Request ,  Response } from "express"
import { NoteModel } from "../models/NoteModels"
import { TaskModel } from "../models/TaskModels"

export class NoteControllers {

    public static async  createNote ( req : Request , res : Response ){ 

        const note = new NoteModel( req.body )
        note.createdBy = req.user.id    
        note.task = req.task.id

        req.task.notes.push(note.id)

        await Promise.allSettled([ note.save() , req.task.save() ])

        res.send( 'nota creada correctamente' )

    }

    public static async  deleteNote ( req : Request , res : Response ){ 
        
        const noteId = req.params.noteId

        const task = req.task.notes.filter((nota) => nota.toString() != noteId  )

        req.task.notes = task 

        const newTask = new TaskModel( req.task )
        const deleteNote = NoteModel.findByIdAndDelete({ _id : noteId }) 

        try {

            await Promise.allSettled([ deleteNote , newTask.save() ])
            
            res.send( 'eliminada correctamente' )
            
        } catch (error) {
            res.status(404).json({ error : "Hubo en error "})
        }

    }
}
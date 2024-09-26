import type { Request , Response } from 'express'
import Note , { INote } from '../models/Note'

export class NoteController { 

    //<{} , {} , INote>  types for req.body
    static createNote = async ( req : Request<{} , {} , INote> , res : Response ) =>  { 

        const { content } = req.body

        const note = new Note()

        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push( note.id )

        // guardamos la nota y guardamos la nota en la tarea
        try {
            await Promise.allSettled([note.save() , req.task.save()])
            res.send('nota creada correctamente')
        } catch (error) {
            res.status(500).json({ errro : 'Hubo un error'})
        }
        
    }

    static getTaskNotes = async ( req : Request , res : Response ) => { 
        try {
            
            const notes = await Note.find( { task : req.task.id} )
            res.json( notes )

        } catch (error) {

            res.status(500).json({ error : 'Hubo un error'})

        }
    }

}
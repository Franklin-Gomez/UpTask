import type { Request , Response } from 'express'
import Note , { INote } from '../models/Note'
import { Types } from 'mongoose'
import { promises } from 'nodemailer/lib/xoauth2'

type NoteParams = { 
    noteId : Types.ObjectId
}

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

    static deleteTaskNotes = async ( req : Request<NoteParams>  , res : Response ) => { 
        
        const { noteId } =  req.params

        const note = await Note.findById( noteId )

        // si no existe la nota
        if(!note) { 
            const error = new Error('Nota no encontrada')
            res.status(404).json({ error : error.message })
        }

        // si la persona no esta autenticada
        if( note.createdBy.toString() !== req.user.id.toString() ){
            const error = new Error('Accion no valida')
            return res.status(401).json({ error : error.message})
        }

        // filtramos las notas de las tareas
        req.task.notes = req.task.notes.filter(( nota ) => nota.toString() !== noteId.toString())

        try {

            await Promise.allSettled([ req.task.save() , note.deleteOne()])
            res.send('Nota Eliminado')
            
        } catch (error) {
            res.status(500).json({ error : 'Hubo un error '})
        }

    }

}
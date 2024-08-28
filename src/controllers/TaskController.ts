import type { Request , Response } from 'express'

export class TaskControllers { 

    static createProject =  async ( req : Request , res : Response) => { 
        try {
            
            const { projectId } = req.params

            console.log( projectId )
        
        } catch (error) {

            console.log( error  )
        
        }
    }
}
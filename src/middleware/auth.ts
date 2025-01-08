import { NextFunction } from "express"
import { UserModel, UserType } from "../models/UserModels"

declare global { 
    namespace Express { 
        interface Request { 
            user : UserType
        }
    }
}

export const userExist = async ( req : Request , res : Response , next : NextFunction ) => { 

    //req.

    //const userExist = await UserModel.findOne({ email : req.body.email })
    
   // next()

}
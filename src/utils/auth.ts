import bcrypt from "bcrypt"

export const hasPassword = async ( password : string) => { 

    const salt = await bcrypt.genSalt(10)

    const hasPassword = await bcrypt.hash( password ,salt )

    return hasPassword
    
}
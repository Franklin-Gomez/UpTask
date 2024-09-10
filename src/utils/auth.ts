import bcrypt from 'bcrypt'


export const hashPassword = async( password : string ) => { 

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hpassword = await bcrypt.hash( password , salt)

    return hpassword
    
}
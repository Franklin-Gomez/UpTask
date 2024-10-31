import mongoose from "mongoose";

export async function conectDB() {

    try {

        await  mongoose.connect( process.env.CONNECTION_DB)

        console.log('conexion exitosa a la base de datos')
        
    } catch (error) {

        console.log('error a conexion a la base de datos')

    }

    
}
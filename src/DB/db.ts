import mongoose from "mongoose";

export async  function conectDB() {

    try {

        console.log( process.env.CONNECTION_DB)

        await  mongoose.connect( process.env.CONNECTION_DB)

        console.log('conexion exitosa a la base de datos')
        
    } catch (error) {

        console.log('error a conexion a la base de datos')

    }

    
}
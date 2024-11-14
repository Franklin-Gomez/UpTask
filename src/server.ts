import express  from 'express'
import router from './routes/ProjectRoutes'
import { conectDB } from './DB/db'
import dotenv from 'dotenv'
import cors from 'cors'

// leer las variables de entorno
dotenv.config()

// conexion a la base de datos
conectDB()

// iniciar el servidor
export const app = express()

// leer datos de json
app.use(express.json());

// permitir peticiones
app.use( cors() )

// rutas permitidas
app.use('/api/projects' , router )

app.get('/' , ( req , res) => { 
    res.send( 'Servidor On')
})
import express  from 'express'
import { conectDB } from './DB/db'
import dotenv from 'dotenv'
import cors from 'cors'
import projectRoutes  from './routes/ProjectRoutes'
import authRoutes from './routes/AuthRoutes'

// leer las variables de entorno
dotenv.config()

// conexion a la base de datos
conectDB()

// iniciar el servidor
export const app = express()

// permitir peticiones
app.use( cors() )

// leer datos de json
app.use(express.json());

// rutas permitidas
app.use('/api/projects' , projectRoutes )
app.use('/api/user' , authRoutes )

app.get('/' , ( req , res) => { 
    res.send( 'Servidor On')
})
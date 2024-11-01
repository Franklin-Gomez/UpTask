import express  from 'express'
import router from './routes/ProjectRoutes'
import { conectDB } from './DB/db'
import dotenv from 'dotenv'

// iniciar el servidor
export const app = express()

// leer las variables de entorno
dotenv.config()

// conexion a la base de datos
conectDB()

// leer datos de json
app.use(express.json());

// rutas permitidas
app.use('/api/projects' , router )
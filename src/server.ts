import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes';


// toma las varaibles de entorno
dotenv.config()

connectDB()

export const app =  express();

// permitir las conexiones
app.use(cors(corsConfig))

// leer datos formato json
app.use( express.json())

// haciendole saber las rutas al server
app.use('/api/projects' , projectRoutes )
app.use('/api/auth' , authRoutes )
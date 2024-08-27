import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes'

// toma las varaibles de entorno
dotenv.config()

connectDB()

export const app =  express();

// leer datos formato json
app.use( express.json())

// haciendole saber las rutas al server
app.use('/api/projects' , projectRoutes )
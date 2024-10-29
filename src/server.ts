import express  from 'express'
import router from './routes/ProjectRoutes'

export const app = express()

app.use('/api/projects' , router )
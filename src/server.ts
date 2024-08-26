import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db';

// toma las varaibles de entorno
dotenv.config()

connectDB()

export const app =  express();
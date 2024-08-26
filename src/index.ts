import { app } from "./server";
import colors from 'colors'

// process.env.port la asigna donde  hagamos el deploymet
const port = process.env.PORT || 4000

app.listen( port , () => { 
    console.log( colors.cyan.bold(`Rest API funcionando en el puerto ${port}`))
})

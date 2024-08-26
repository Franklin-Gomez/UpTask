import { app } from "./server";


// process.env.port la asigna donde  hagamos el deploymet
const port = process.env.PORT || 4000

app.listen( port , () => { 
    console.log(`Rest API funcionando en el puerto ${port}`)
})

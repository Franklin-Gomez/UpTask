import express  from 'express'

const server = express()

server.listen( 4000, () => { 
    console.log('desde puerto 4000')
})

server.get('/' , ( req , res ) => { 
    res.send('hola mundo')
})
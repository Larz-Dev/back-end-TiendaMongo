
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import conectarDb from './src/models/config.js'
import usuario from './src/routes/usuario.js'
import inventario from './src/routes/inventario.js'
import factura from  './src/routes/facturadetalle.js'
import rol from './src/routes/rol.js'
import categoria from './src/routes/categoria.js'
import bodyParser from 'body-parser'
const app = express()
conectarDb()  //llama el metodo constructor de la clase conexion
app.use(cors())

//ruta por defecto
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.json())
app.use('/api/usuario', usuario)
app.use('/api/inventario', inventario)
app.use('/api/rol', rol)

app.use('/api/categoria', categoria)

app.use('/api/factura', factura)


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
}) 
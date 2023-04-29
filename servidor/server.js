require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

// MODULES

const clientes = require('./api/clientes')
const documentos = require('./api/documentos')
const direcciones = require('./api/direcciones')

// CLIENTES

app.get('/clientes/getallclientes', (req, res) => {
    clientes.getAllClientes(req, res)
})

app.post('/clientes/createcliente', (req, res) => {
    clientes.createCliente(req, res)
})

app.delete('/clientes/removecliente/:id_cliente', (req, res) => {
    clientes.removeCliente(req, res)
})

app.put('/clientes/updatecliente/:id_cliente', (req, res) => {
    clientes.updateCliente(req, res)
})

app.get('/clientes/downloadclientes', (req, res) => {
    clientes.downloadClientesCSV(req, res)
})

// DOCUMENTOS

app.get('/documentos/getdocumentosbyidcliente/:id_cliente', (req, res) => {
    documentos.getDocumentosByIdCliente(req, res)
})

app.post('/documentos/createdocumento', (req, res) => {
    documentos.createDocumento(req, res)
})

app.put('/documentos/updatedocumento/:id_documento', (req, res) => {
    documentos.updateDocumento(req, res)
})

app.delete('/documentos/removedocumento/:id_documento', (req, res) => {
    documentos.removeDocumento(req, res)
})

app.get('/documentos/downloaddocumentos', (req, res) => {
    documentos.downloadDocumentosCSV(req, res)
})

// DIRECCIONES

app.get('/direcciones/getdireccionesbyidcliente/:id_cliente', (req, res) => {
    direcciones.getDireccionesByIdCliente(req, res)
})

app.post('/direcciones/createdireccion', (req, res) => {
    direcciones.createDireccion(req, res)
})

app.put('/direcciones/updatedireccion/:id_direccion', (req, res) => {
    direcciones.updateDireccion(req, res)
})

app.delete('/direcciones/removedireccion/:id_direccion', (req, res) => {
    direcciones.removeDireccion(req, res)
})

app.get('/direcciones/downloaddirecciones', (req, res) => {
    direcciones.downloadDireccionesCSV(req, res)
})


app.listen(port, ( )=> console.log(`Server running on port:${port}`))

const pool = require('../db-connection');
const Json2csvParser = require("json2csv").Parser;

const getAllClientes = async function (req, res) {
    try {
        const clientes = await pool.query('SELECT id_cliente, nombre, apellido, genero, telefono, email, TO_CHAR(fecha_nacimiento, \'YYYY-MM-DD\') AS fecha_nacimiento FROM clientes ORDER BY id_cliente DESC')
        res.json(clientes.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const createCliente = async function (req, res) {
    const {id_cliente, nombre, apellido, genero, telefono, email, fecha_nacimiento} = req.body

    try {
        const newCliente = await pool.query('INSERT INTO clientes(nombre, apellido, genero, telefono, email, fecha_nacimiento) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', 
            [nombre, apellido, genero, telefono, email, fecha_nacimiento])
        res.json(newCliente.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const updateCliente = async function (req, res) {
    const { id_cliente } = req.params
    const {id_cliente_body, nombre, apellido, genero, telefono, email, fecha_nacimiento} = req.body

    try {
        const updatedCliente = await pool.query('UPDATE clientes SET nombre = $1, apellido = $2, genero = $3, telefono = $4, email = $5, fecha_nacimiento = $6 WHERE id_cliente = $7 RETURNING *', 
            [nombre, apellido, genero, telefono, email, fecha_nacimiento, id_cliente])
        res.json(updatedCliente.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const removeCliente = async function (req, res) {
    const { id_cliente } = req.params
    try {
        const removeCliente = await pool.query('DELETE FROM clientes WHERE id_cliente = $1;', [id_cliente])
        res.json(removeCliente)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const downloadClientesCSV = async function (req, res) {
    try {
        const clientes = await pool.query('SELECT id_cliente, nombre, apellido, genero, telefono, email, TO_CHAR(fecha_nacimiento, \'DD-MM-YYYY\') AS fecha_nacimiento FROM clientes ORDER BY id_cliente ASC')
        const jsonData = JSON.parse(JSON.stringify(clientes.rows));

        // -> Convert JSON to CSV data
        const csvFields = ['id_cliente', 'nombre', 'apellido', 'genero', 'telefono', 'email', 'fecha_nacimiento'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csv = json2csvParser.parse(jsonData);

        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=clientes.csv");
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

module.exports = { getAllClientes , createCliente, removeCliente, updateCliente, downloadClientesCSV }
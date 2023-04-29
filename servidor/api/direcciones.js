const pool = require('../db-connection');
const Json2csvParser = require("json2csv").Parser;

const getDireccionesByIdCliente = async function (req, res) {
    const { id_cliente } = req.params
    try {
        const direcciones = await pool.query(
            'SELECT * FROM direcciones WHERE id_cliente = $1 ORDER BY id_direccion DESC', [id_cliente]
        )
        res.json(direcciones.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const updateDireccion = async function (req, res) {
    const { id_direccion } = req.params
    const {id_direccion_body, id_cliente, direccion_1, direccion_2, pais, departamento, municipio} = req.body

    try {
        const updatedDireccion = await pool.query('UPDATE direcciones SET direccion_1 = $1, direccion_2 = $2, pais = $3, departamento = $4, municipio = $5 WHERE id_direccion = $6 RETURNING *', 
            [direccion_1, direccion_2, pais, departamento, municipio, id_direccion])
        res.json(updatedDireccion.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const createDireccion = async function (req, res) {
    const {id_direccion, id_cliente, direccion_1, direccion_2, pais, departamento, municipio} = req.body

    try {
        const newDireccion = await pool.query('INSERT INTO direcciones(id_cliente, direccion_1, direccion_2, pais, departamento, municipio) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', 
            [id_cliente, direccion_1, direccion_2, pais, departamento, municipio])
        res.json(newDireccion.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const removeDireccion = async function (req, res) {
    const { id_direccion } = req.params
    try {
        const removedDireccion = await pool.query('DELETE FROM direcciones WHERE id_direccion = $1;', [id_direccion])
        res.json(removedDireccion)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const downloadDireccionesCSV = async function (req, res) {
    try {
        const direcciones = await pool.query('SELECT * FROM direcciones ORDER BY id_direccion ASC')
        const jsonData = JSON.parse(JSON.stringify(direcciones.rows));

        // -> Convert JSON to CSV data
        const csvFields = ['id_direccion', 'id_cliente', 'direccion_1', 'direccion_2', 'pais', 'departamento', 'municipio'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csv = json2csvParser.parse(jsonData);

        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=direcciones.csv");
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}
module.exports = { getDireccionesByIdCliente, updateDireccion, createDireccion, removeDireccion, downloadDireccionesCSV }
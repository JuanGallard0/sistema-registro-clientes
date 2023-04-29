const pool = require('../db-connection');
const Json2csvParser = require("json2csv").Parser;

const getDocumentosByIdCliente = async function (req, res) {
    const { id_cliente } = req.params
    try {
        const documentos = await pool.query(
            'SELECT * FROM documentos WHERE id_cliente = $1 ORDER BY id_documento DESC', [id_cliente]
        )
        res.json(documentos.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const updateDocumento = async function (req, res) {
    const { id_documento } = req.params
    const {id_documento_body, id_cliente, tipo, numero} = req.body

    try {
        const updatedDocumento = await pool.query('UPDATE documentos SET tipo = $1, numero = $2 WHERE id_documento = $3 RETURNING *', 
            [tipo, numero, id_documento])
        res.json(updatedDocumento.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const createDocumento = async function (req, res) {
    const {id_documento, id_cliente, tipo, numero} = req.body

    try {
        const newDocumento = await pool.query('INSERT INTO documentos(id_cliente, tipo, numero) VALUES($1, $2, $3) RETURNING *', 
            [id_cliente, tipo, numero])
        res.json(newDocumento.rows)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const removeDocumento = async function (req, res) {
    const { id_documento } = req.params
    try {
        const removedDocumento = await pool.query('DELETE FROM documentos WHERE id_documento = $1;', [id_documento])
        res.json(removedDocumento)
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}

const downloadDocumentosCSV = async function (req, res) {
    try {
        const documentos = await pool.query('SELECT * FROM documentos ORDER BY id_documento ASC')
        const jsonData = JSON.parse(JSON.stringify(documentos.rows));

        // -> Convert JSON to CSV data
        const csvFields = ['id_documento', 'id_cliente', 'tipo', 'numero'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csv = json2csvParser.parse(jsonData);

        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=documentos.csv");
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log("Error: " + error.message)
    }
}
module.exports = { getDocumentosByIdCliente, createDocumento, updateDocumento, removeDocumento, downloadDocumentosCSV }
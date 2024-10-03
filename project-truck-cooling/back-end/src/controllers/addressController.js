const pool = require('../models/db');

const getProvinsi = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT provinsi FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No provinces found.' });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).send({ error: err.message });
    }
};

const geKabupatenKota = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT kabupaten_kota FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No provinces found.' });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).send({ error: err.message });
    }
};

const getKecamatan = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT kecamatan FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No provinces found.' });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).send({ error: err.message });
    }
};

module.exports = { getProvinsi, geKabupatenKota, getKecamatan };

  
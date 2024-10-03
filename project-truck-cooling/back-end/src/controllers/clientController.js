const pool = require('../models/db');

// Create Client
const createClient = async (req, res) => {
  const { nama_client, alamat_client, provinsi, kabupaten_kota, kecamatan, kode_pos, no_hp, email, tgl_bergabung } = req.body;
  try {
    const emailCheck = await pool.query('SELECT * FROM Client WHERE email = $1', [email]);
    
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const result = await pool.query(
      'INSERT INTO Client (nama_client, alamat_client, provinsi, kabupaten_kota, kecamatan, kode_pos, no_hp, email, tgl_bergabung) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [nama_client, alamat_client, provinsi, kabupaten_kota, kecamatan, kode_pos, no_hp, email, tgl_bergabung]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get Client
const getClients = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM Client');
    const totalClients = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      'SELECT * FROM Client ORDER BY id_client LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const totalPages = Math.ceil(totalClients / limit);

    res.status(200).json({
      clients: result.rows,
      currentPage: page,
      totalPages: totalPages,
      totalClients: totalClients,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Detail Client
const detailClients = async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await pool.query('SELECT * FROM Client WHERE id_client = $1', [id]);
    
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update Client
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { nama_client, alamat_client, provinsi, kabupaten_kota, kecamatan, kode_pos, no_hp, email, tgl_bergabung } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Client SET nama_client=$1, alamat_client=$2, provinsi=$3, kabupaten_kota=$4, kecamatan=$5, kode_pos=$6, no_hp=$7, email=$8, tgl_bergabung=$9 WHERE id_client=$10 RETURNING *',
      [nama_client, alamat_client, provinsi, kabupaten_kota, kecamatan, kode_pos, no_hp, email, tgl_bergabung, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete Client
const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Client WHERE id_client=$1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Suspend Client
const suspendClient = async (req, res) => {
  const { id } = req.query;
  const clientId = parseInt(id, 10); 

  if (isNaN(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID' });
  }

  try {
    const result = await pool.query(
      'UPDATE Client SET status_akun=$1 WHERE id_client=$2 RETURNING *',
      ['Suspend', clientId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Restore Client
const restoreClient = async (req, res) => {
  const { id } = req.query;
  const clientId = parseInt(id, 10); 

  if (isNaN(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID' });
  }

  try {
    const result = await pool.query(
      'UPDATE Client SET status_akun=$1 WHERE id_client=$2 RETURNING *',
      ['Aktif', clientId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports = {
  createClient,
  getClients,
  detailClients,
  updateClient,
  deleteClient,
  suspendClient,
  restoreClient
};
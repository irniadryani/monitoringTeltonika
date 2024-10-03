const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/provinsi', addressController.getProvinsi);
router.get('/kecamatan', addressController.getKecamatan);
router.get('/kabupaten-kota', addressController.geKabupatenKota);

module.exports = router;

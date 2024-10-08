const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// CRUD routes
router.post('/clients', clientController.createClient);
router.get('/clients', clientController.getClients);
router.put('/clients/suspend', clientController.suspendClient);
router.put('/clients/restore', clientController.restoreClient);
router.get('/clients/:id', clientController.detailClients);
router.put('/clients/:id', clientController.updateClient);
router.delete('/clients/:id', clientController.deleteClient);


module.exports = router;

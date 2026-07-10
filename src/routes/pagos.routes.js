const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');

router.get('/', pagosController.listarPagos);
router.post('/', pagosController.registrarPago);

module.exports = router;

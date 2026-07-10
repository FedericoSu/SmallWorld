const express = require('express');
const router = express.Router();
const economiaController = require('../controllers/economia.controller');

router.get('/pagos-por-mes', economiaController.pagosPorMes);
router.get('/salarios-por-departamento', economiaController.salariosPorDepartamento);

module.exports = router;

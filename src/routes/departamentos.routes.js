const express = require('express');
const router = express.Router();
const departamentosController = require('../controllers/departamentos.controller');

router.get('/', departamentosController.listarDepartamentos);
router.get('/:id', departamentosController.obtenerDepartamento);

module.exports = router;

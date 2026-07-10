const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleados.controller');

router.get('/', empleadosController.listarEmpleados);
router.get('/:id', empleadosController.obtenerEmpleado);
router.post('/', empleadosController.crearEmpleado);
router.put('/:id/salario', empleadosController.actualizarSalario);
router.delete('/:id', empleadosController.eliminarEmpleado);

module.exports = router;

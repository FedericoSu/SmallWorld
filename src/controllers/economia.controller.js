// Controlador de reportes economicos.
// Aca es donde se cruza informacion entre las tres tablas.
const pool = require('../config/db');

// GET /api/economia/pagos-por-mes
// Cuanto pago la empresa en salarios, agrupado por mes y anio.
async function pagosPorMes(req, res) {
    try {
        const result = await pool.query(`
            SELECT anio, mes, COUNT(*) AS cantidad_pagos, SUM(monto_pagado) AS total_pagado
            FROM pagos_salarios
            GROUP BY anio, mes
            ORDER BY anio DESC, mes DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular los pagos por mes', detalle: error.message });
    }
}

// GET /api/economia/salarios-por-departamento
// Suma de salarios actuales de los empleados, agrupada por departamento,
// comparada contra el presupuesto mensual de ese departamento.
async function salariosPorDepartamento(req, res) {
    try {
        const result = await pool.query(`
            SELECT d.id AS departamento_id, d.nombre AS departamento,
                   d.presupuesto_mensual,
                   COUNT(e.id) AS cantidad_empleados,
                   COALESCE(SUM(e.salario), 0) AS total_salarios
            FROM departamentos d
            LEFT JOIN empleados e ON e.departamento_id = d.id
            GROUP BY d.id, d.nombre, d.presupuesto_mensual
            ORDER BY d.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular los salarios por departamento', detalle: error.message });
    }
}

module.exports = {
    pagosPorMes,
    salariosPorDepartamento,
};

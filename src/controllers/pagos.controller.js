// Controlador de pagos de salarios.
const pool = require('../config/db');

// POST /api/pagos
// Registra el pago de salario de un empleado para un mes/anio determinado.
async function registrarPago(req, res) {
    const { empleado_id, mes, anio, monto_pagado, fecha_pago } = req.body;

    if (!empleado_id || !mes || !anio || monto_pagado === undefined) {
        return res.status(400).json({ error: 'empleado_id, mes, anio y monto_pagado son obligatorios' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO pagos_salarios (empleado_id, mes, anio, monto_pagado, fecha_pago)
            VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
            RETURNING *
        `, [empleado_id, mes, anio, monto_pagado, fecha_pago || null]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // UNIQUE (empleado_id, mes, anio)
            return res.status(409).json({ error: 'Ya existe un pago cargado para ese empleado en ese mes/anio' });
        }
        if (error.code === '23503') { // FOREIGN KEY: empleado_id no existe
            return res.status(400).json({ error: 'El empleado indicado no existe' });
        }
        res.status(500).json({ error: 'Error al registrar el pago', detalle: error.message });
    }
}

// GET /api/pagos
// Lista los pagos registrados. Permite filtrar por empleado con ?empleado_id=
async function listarPagos(req, res) {
    const { empleado_id } = req.query;

    try {
        const result = empleado_id
            ? await pool.query(
                'SELECT * FROM pagos_salarios WHERE empleado_id = $1 ORDER BY anio DESC, mes DESC',
                [empleado_id]
            )
            : await pool.query('SELECT * FROM pagos_salarios ORDER BY anio DESC, mes DESC');

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar pagos', detalle: error.message });
    }
}

module.exports = {
    registrarPago,
    listarPagos,
};

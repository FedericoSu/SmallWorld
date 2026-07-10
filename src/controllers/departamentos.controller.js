// Controlador de departamentos.
const pool = require('../config/db');

// GET /api/departamentos
async function listarDepartamentos(req, res) {
    try {
        const result = await pool.query(
            'SELECT id, nombre, presupuesto_mensual FROM departamentos ORDER BY id'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar departamentos', detalle: error.message });
    }
}

// GET /api/departamentos/:id
async function obtenerDepartamento(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, nombre, presupuesto_mensual FROM departamentos WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el departamento', detalle: error.message });
    }
}

module.exports = {
    listarDepartamentos,
    obtenerDepartamento,
};

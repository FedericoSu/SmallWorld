// Controlador de empleados: contiene la logica de cada endpoint.
// Las rutas (routes) solo dicen "que URL dispara que funcion";
// aca es donde realmente se habla con la base de datos.
const pool = require('../config/db');

// GET /api/empleados
// Lista todos los empleados, con el nombre de su departamento incluido.
async function listarEmpleados(req, res) {
    try {
        const result = await pool.query(`
            SELECT e.id, e.nombre, e.apellido, e.email, e.puesto, e.salario,
                   e.fecha_ingreso, e.departamento_id, d.nombre AS departamento
            FROM empleados e
            LEFT JOIN departamentos d ON d.id = e.departamento_id
            ORDER BY e.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar empleados', detalle: error.message });
    }
}

// GET /api/empleados/:id
async function obtenerEmpleado(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.id, e.nombre, e.apellido, e.email, e.puesto, e.salario,
                   e.fecha_ingreso, e.departamento_id, d.nombre AS departamento
            FROM empleados e
            LEFT JOIN departamentos d ON d.id = e.departamento_id
            WHERE e.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el empleado', detalle: error.message });
    }
}

// POST /api/empleados
// Crea un empleado nuevo. Los campos obligatorios son nombre, apellido, email y salario.
async function crearEmpleado(req, res) {
    const { nombre, apellido, email, puesto, salario, fecha_ingreso, departamento_id } = req.body;

    if (!nombre || !apellido || !email || salario === undefined) {
        return res.status(400).json({ error: 'nombre, apellido, email y salario son obligatorios' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO empleados (nombre, apellido, email, puesto, salario, fecha_ingreso, departamento_id)
            VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7)
            RETURNING *
        `, [nombre, apellido, email, puesto || null, salario, fecha_ingreso || null, departamento_id || null]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // violacion de UNIQUE (email repetido)
            return res.status(409).json({ error: 'Ya existe un empleado con ese email' });
        }
        res.status(500).json({ error: 'Error al crear el empleado', detalle: error.message });
    }
}

// PUT /api/empleados/:id/salario
// Actualiza unicamente el salario de un empleado.
async function actualizarSalario(req, res) {
    const { id } = req.params;
    const { salario } = req.body;

    if (salario === undefined || salario < 0) {
        return res.status(400).json({ error: 'Debe indicar un salario valido (numero mayor o igual a 0)' });
    }

    try {
        const result = await pool.query(
            'UPDATE empleados SET salario = $1 WHERE id = $2 RETURNING *',
            [salario, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el salario', detalle: error.message });
    }
}

// DELETE /api/empleados/:id
async function eliminarEmpleado(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM empleados WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json({ mensaje: 'Empleado eliminado', id: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el empleado', detalle: error.message });
    }
}

module.exports = {
    listarEmpleados,
    obtenerEmpleado,
    crearEmpleado,
    actualizarSalario,
    eliminarEmpleado,
};

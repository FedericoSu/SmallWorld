// Configuracion de la conexion a PostgreSQL.
// Se usa un "pool" de conexiones: en vez de abrir y cerrar una conexion
// por cada consulta, se reutiliza un grupo pequeno de conexiones abiertas.
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'empresa_admin',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

module.exports = pool;

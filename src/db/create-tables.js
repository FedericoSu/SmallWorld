// Script para crear las tablas en PostgreSQL a partir de db/schema.sql
// Uso: npm run db:create
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function createTables() {
    const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    try {
        await pool.query(schemaSql);
        console.log('Tablas creadas correctamente.');
    } catch (error) {
        console.error('Error creando las tablas:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

createTables();

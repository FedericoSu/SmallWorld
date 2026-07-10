// Script para cargar datos de ejemplo a partir de db/seed.sql
// Uso: npm run db:seed
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function seedDatabase() {
    const seedPath = path.join(__dirname, '..', '..', 'db', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    try {
        await pool.query(seedSql);
        console.log('Datos de ejemplo cargados correctamente.');
    } catch (error) {
        console.error('Error cargando los datos de ejemplo:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

seedDatabase();

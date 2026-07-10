// Configuracion de la aplicacion Express: middlewares y rutas.
// server.js es quien realmente "levanta" el servidor usando esta app.
const express = require('express');
const path = require('path');

const empleadosRoutes = require('./routes/empleados.routes');
const departamentosRoutes = require('./routes/departamentos.routes');
const pagosRoutes = require('./routes/pagos.routes');
const economiaRoutes = require('./routes/economia.routes');

const app = express();

// Permite leer JSON en el body de los requests (req.body)
app.use(express.json());

// Frontend estatico (HTML/CSS/JS sin build): sirve public/index.html en "/"
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/empleados', empleadosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/economia', economiaRoutes);

// Manejo de rutas que no existen
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;

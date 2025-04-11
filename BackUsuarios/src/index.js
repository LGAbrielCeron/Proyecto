const express = require('express');
const morgan = require('morgan');
const usuariosController = require('./controllers/usuariosController');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/', usuariosController);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Usuarios service running on port ${PORT}`);
});
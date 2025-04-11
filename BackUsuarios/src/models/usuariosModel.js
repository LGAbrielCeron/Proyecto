const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'UsuarioMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const traerUsuarios = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return rows;
    } catch (error) {
        console.error('Error in traerUsuarios:', error);
        throw error;
    }
};

const traerUsuario = async (username) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows;
    } catch (error) {
        console.error('Error in traerUsuario:', error);
        throw error;
    }
};

const validarUsuario = async (username, password) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE username = ? AND password = ?',
            [username, password]
        );
        return rows;
    } catch (error) {
        console.error('Error in validarUsuario:', error);
        throw error;
    }
};

const esAdmin = async (username) => {
    try {
        const [rows] = await pool.query(
            'SELECT role FROM usuarios WHERE username = ?',
            [username]
        );
        return rows[0]?.role === 'ADMIN';
    } catch (error) {
        console.error('Error in esAdmin:', error);
        throw error;
    }
};

const crearUsuario = async (username, email, password) => {
    try {
        // First, insert the user
        await pool.query(
            'INSERT INTO usuarios (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, 'USER']
        );
        
        // Then, fetch the created user
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE username = ?',
            [username]
        );
        return rows[0];
    } catch (error) {
        console.error('Error in crearUsuario:', error);
        throw error;
    }
};

module.exports = {
    traerUsuarios,
    traerUsuario,
    validarUsuario,
    esAdmin,
    crearUsuario
};
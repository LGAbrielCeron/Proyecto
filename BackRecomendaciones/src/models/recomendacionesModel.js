const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'RecomendacionesMS'
});

async function crearRecomendacion(user_id, catalogo_id, puntuacion) {
    try {
        const query = 'INSERT INTO recomendaciones (user_id, catalogo_id, puntuacion) VALUES (?, ?, ?)';
        const [result] = await connection.query(query, [user_id, catalogo_id, puntuacion]);
        return {
            id: result.insertId,
            user_id,
            catalogo_id,
            puntuacion
        };
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Error al crear la recomendación en la base de datos');
    }
}

// Make sure this function is exported
module.exports = {
    traerRecomendaciones,
    traerRecomendacion,
    crearRecomendacion  // Add this line if it's missing
}


async function traerRecomendaciones() {
    const result = await connection.query('SELECT * FROM recomendaciones');
    return result[0];
}


async function traerRecomendacion(id) {
    const result = await connection.query('SELECT * FROM recomendaciones WHERE id = ?', id);
    return result[0];
}

module.exports = {
    crearRecomendacion,
    traerRecomendaciones,
    traerRecomendacion
}
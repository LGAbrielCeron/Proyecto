
const { Router, text } = require('express');
const usuariosModel = require('../models/usuariosModel');

const router = Router();



// ✅ Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    var result;
    result = await usuariosModel.traerUsuarios() ;
    res.json(result);
});

router.get('/usuarios/:username', async (req, res) => {
    const username = req.params.username;
    var result;

    try {
        result = await usuariosModel.traerUsuario(username);

        // Verificar si se encontró algún usuario
        if (result && result.length > 0) {
            res.json(result[0]); // Enviar el primer usuario encontrado
        } else {
            // Si no se encontró ningún usuario, enviar una respuesta 404 Not Found
            res.status(404).json({ mensaje: `No se encontró ningún usuario con el nombre de usuario: ${username}` });
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la consulta a la base de datos
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al buscar el usuario' });
    }
});



/*
// ✅ Verificar si un usuario es administrador
router.get('/usuarios/:username/admin', async (req, res) => {
    try {
        const username = req.params.username;

        // Buscar el username en la tabla usuariosms (simulado con usuariosModel.buscarUsuario)
        const usuario = await usuariosModel.buscarUsuario(username); // Asumiendo que esta función existe

        if (!usuario) {
            // Si el username no está en usuariosms, retornar error (Usuario no encontrado)
            return res.status(404).json({ error: "Usuario no encontrado" });
        } else {
            // Si el username está en usuariosms, obtener el rol del usuario
            const role = usuario.role; // Asumiendo que el objeto usuario tiene una propiedad 'role'

            // Verificar el rol
            if (role === 'ADMIN') {
                // Si el rol es 'ADMIN', retornar TRUE (200 OK con isAdmin: true)
                return res.json({ isAdmin: true });
            } else {
                // Si el rol no es 'ADMIN', retornar FALSE (200 OK con isAdmin: false)
                return res.json({ isAdmin: false });
            }
        }
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ error: "Error al verificar admin" });
    }
});
*/



router.get('/usuarios/:username/admin', async (req, res) => {
    const username = req.params.username;

    try {
        result = await usuariosModel.esAdmin(username);
        const usuarios = await usuariosModel.traerUsuario(username);
        if (usuarios && usuarios.length > 0) {
            const usuario = usuarios[0];
            const esAdmin = usuario.role === 'ADMIN';
            res.json(esAdmin);
        } else {
            res.status(404).json({ mensaje: `No se encontró ningún usuario con el nombre de usuario: ${username}` });
        }
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al buscar el usuario' });
    }
});





// ✅ Validar credenciales de usuario
router.get('/usuarios/:username/:password', async (req, res) => {
    const { username, password } = req.params;

    try {
        const usuario = await usuariosModel.validarUsuario(username, password);
        
        if (usuario && usuario.length > 0) {
            // Si el usuario existe, devolver información relevante
            const usuarioInfo = {
                username: usuario[0].username,
                role: usuario[0].role,
                isValid: true
            };
            res.json(usuarioInfo);
        } else {
            // Si no se encuentra el usuario o las credenciales son incorrectas
            res.status(401).json({
                message: 'Credenciales inválidas',
                isValid: false
            });
        }
    } catch (error) {
        console.error("Error al validar las credenciales:", error);
        res.status(500).json({ 
            message: 'Error interno del servidor al validar las credenciales.',
            error: error.message 
        });
    }
});


// ✅ Crear un nuevo usuario
router.post('/usuario', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const nuevoUsuario = await usuariosModel.crearUsuario(username, email, password);
        res.status(201).json({ 
            message: "Usuario creado exitosamente", 
            usuario: nuevoUsuario 
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

/*
{
        "username": "admin1",
        "email": "admin1@domain.com",
        "role": "ADMIN"
    }
*/

module.exports = router;
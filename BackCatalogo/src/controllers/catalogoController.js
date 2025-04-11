const { Router } = require('express');
const catalogoModel = require('../models/catalogoModel');
const axios = require('axios');

const router = Router();

// Middleware to check admin status
const checkAdmin = async (req, res, next) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(401).json({ mensaje: 'Usuario no especificado' });
        }

        const response = await axios.get(`http://localhost:5002/usuarios/${username}/admin`);
        const isAdmin = response.data;

        if (!isAdmin) {
            return res.status(403).json({ mensaje: 'Acceso denegado: Se requieren privilegios de administrador' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ mensaje: 'Error al verificar privilegios de administrador' });
    }
};

// Get all products
router.get('/catalogo', async (req, res) => {
    try {
        const result = await catalogoModel.traerProductos();
        res.json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// Get product by ID
router.get('/catalogo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await catalogoModel.traerProducto(id);
        
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ mensaje: `No se encontró el producto con ID: ${id}` });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// Create new product (ADMIN only)
router.post('/catalogo/admin/:username', checkAdmin, async (req, res) => {
    try {
        const username = req.params.username;
        
        // Verify user exists
        const userResponse = await axios.get(`http://localhost:5002/usuarios/${username}`);
        if (!userResponse.data) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const result = await catalogoModel.crearProducto(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// Update product (ADMIN only)
router.put('/catalogo/:id/:username', checkAdmin, async (req, res) => {
    try {
        const { id, username } = req.params;
        
        // Verify user exists
        const userResponse = await axios.get(`http://localhost:5002/usuarios/${username}`);
        if (!userResponse.data) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const result = await catalogoModel.actualizarProducto(id, req.body);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        } else {
            res.json({ mensaje: 'Producto actualizado exitosamente' });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// Delete product (ADMIN only)
router.delete('/catalogo/:id/:username', checkAdmin, async (req, res) => {
    try {
        const { id, username } = req.params;
        
        // Verify user exists
        const userResponse = await axios.get(`http://localhost:5002/usuarios/${username}`);
        if (!userResponse.data) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const result = await catalogoModel.eliminarProducto(id);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        } else {
            res.json({ mensaje: 'Producto eliminado exitosamente' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;
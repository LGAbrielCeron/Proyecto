const { Router } = require('express');
const router = Router();
const recomendacionesModel = require('../models/recomendacionesModel');


// Crear una nueva recomendación
router.post('/recomendaciones/publicar/:user_id/:catalogo_id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const catalogo_id = parseInt(req.params.catalogo_id);
        const { puntuacion } = req.body;

        // Validate input
        if (!user_id || !catalogo_id || !puntuacion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Validate that IDs are valid numbers
        if (isNaN(user_id) || isNaN(catalogo_id)) {
            return res.status(400).json({ error: "IDs inválidos" });
        }

        // Validate puntuacion is between 1 and 5
        if (puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ error: "La puntuación debe estar entre 1 y 5" });
        }

        const nuevaRecomendacion = await recomendacionesModel.crearRecomendacion(user_id, catalogo_id, puntuacion);
        res.status(201).json({
            message: "Recomendación creada exitosamente",
            data: nuevaRecomendacion
        });
    } catch (error) {
        console.error('Error creating recommendation:', error);
        res.status(500).json({ error: "Error al crear la recomendación" });
    }
});

// GET routes with proper error handling
router.get('/recomendaciones', async (req, res) => {
    try {
        const result = await recomendacionesModel.traerRecomendaciones();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener recomendaciones" });
    }
});

router.get('/recomendaciones/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await recomendacionesModel.traerRecomendacion(id);
        if (!result[0]) {
            return res.status(404).json({ error: "Recomendación no encontrada" });
        }
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la recomendación" });
    }
});






module.exports = router;

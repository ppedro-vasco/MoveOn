const express = require('express');
const router = express.Router();
const restaurantModel = require('../models/RestaurantModel');

// Rota para obter todos os ingredientes
router.get('/ingredientes', (req, res) => {
    const ingredientes = restaurantModel.getIngredientes();
    res.json(ingredientes);
});

// Futuras rotas para cardápios e encomendas
// router.post('/cardapio', (req, res) => { ... }); // Admin
// router.get('/cardapio/semanal', (req, res) => { ... });
// router.post('/encomenda', (req, res) => { ... }); // User/Admin

module.exports = router;
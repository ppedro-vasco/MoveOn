const express = require('express');
const router = express.Router();
const userModel = require('../models/UserModel');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = userModel.getUserByUsername(username);

    if (user && user.password === password) {
        // Retorna informações básicas do usuário e seu tipo
        // Em um app real, aqui você geraria um JWT
        const { id, username, type, name } = user;
        return res.json({
            message: "Login successful",
            user_id: id,
            username: username,
            user_type: type,
            name: name
        });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
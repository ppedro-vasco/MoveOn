const express = require('express');
const router = express.Router();
const userModel = require('../models/UserModel');

// Middleware de autenticação/autorização simples para MVP (pode ser aprimorado)
// Por enquanto, não faremos validação de token, mas sim de tipo de usuário se necessário
const adminAuth = (req, res, next) => {
    // Para MVP, vamos assumir que o frontend enviará algum identificador de admin ou simplesmente confiar no caminho
    // Em um sistema real, haveria verificação de token JWT e permissões.
    // Por simplicidade para o MVP, todas as rotas de usuários que exigem admin serão acessíveis por enquanto.
    // Mais tarde, introduziremos JWT e validação real.
    next();
};

router.get('/', adminAuth, (req, res) => {
    const users = userModel.getAllUsers().map(user => {
        const { password, ...rest } = user; // Remove a senha para segurança
        return rest;
    });
    res.json(users);
});

router.get('/:id', adminAuth, (req, res) => {
    const user = userModel.getUserById(req.params.id);
    if (user) {
        const { password, ...rest } = user;
        return res.json(rest);
    }
    res.status(404).json({ message: "User not found" });
});

router.post('/', adminAuth, (req, res) => {
    const userData = req.body;
    // Validação básica de campos
    if (userData.type === 'admin') {
        if (!userData.name || !userData.cpf || !userData.username || !userData.password) {
            return res.status(400).json({ message: "Missing fields for admin user" });
        }
    } else if (userData.type === 'user') {
        if (!userData.name || !userData.registro || !userData.username || !userData.password) {
            return res.status(400).json({ message: "Missing fields for regular user" });
        }
    } else {
        return res.status(400).json({ message: "Invalid user type" });
    }

    const newUser = userModel.addUser(userData);
    const { password, ...rest } = newUser;
    res.status(201).json(rest);
});

router.put('/:id', adminAuth, (req, res) => {
    const updatedData = req.body;
    const updatedUser = userModel.updateUser(req.params.id, updatedData);
    if (updatedUser) {
        const { password, ...rest } = updatedUser;
        return res.json(rest);
    }
    res.status(404).json({ message: "User not found" });
});

router.delete('/:id', adminAuth, (req, res) => {
    if (userModel.deleteUser(req.params.id)) {
        return res.status(200).json({ message: "User deleted successfully" });
    }
    res.status(404).json({ message: "User not found" });
});

module.exports = router;
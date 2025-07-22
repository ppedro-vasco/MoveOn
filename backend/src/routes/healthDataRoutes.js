const express = require('express');
const router = express.Router();
const healthDataModel = require('../models/HealthDataModel');

const authMiddleware = (req, res, next) => {
    next();
};

router.get('/', authMiddleware, (req, res) => {
    const allHealthData = healthDataModel.getAllHealthData();
    // Log para verificar data_exame antes de enviar para o frontend
    allHealthData.forEach((record, index) => {
        console.log(`Backend (Routes - GET /): Record ${index} ID: ${record.id}, data_exame: ${record.data_exame} (Type: ${typeof record.data_exame})`);
    });
    res.json(allHealthData);
});

router.get('/user/:userId', authMiddleware, (req, res) => {
    const userHealthData = healthDataModel.getHealthDataByUserId(req.params.userId);
    // Log para verificar data_exame antes de enviar para o frontend (rota de usuário)
    userHealthData.forEach((record, index) => {
        console.log(`Backend (Routes - GET /user/): Record ${index} ID: ${record.id}, data_exame: ${record.data_exame} (Type: ${typeof record.data_exame})`);
    });
    if (userHealthData.length > 0) {
        return res.json(userHealthData);
    }
    res.status(404).json({ message: "No health data found for this user." });
});

router.get('/:id', authMiddleware, (req, res) => {
    const record = healthDataModel.getHealthDataById(req.params.id);
    if (record) {
        // Log para verificar data_exame antes de enviar (rota de um único registro)
        console.log(`Backend (Routes - GET /:id): Record ID: ${record.id}, data_exame: ${record.data_exame} (Type: ${typeof record.data_exame})`);
        return res.json(record);
    }
    res.status(404).json({ message: "Health data record not found." });
});

router.post('/', authMiddleware, (req, res) => {
    const data = req.body;
    // Log para verificar data_exame ao receber do frontend
    console.log(`Backend (Routes - POST /): Recebido data_exame: ${data.data_exame} (Type: ${typeof data.data_exame})`);

    if (!data.user_id || !data.data_exame || !data.gender) {
        return res.status(400).json({ message: "User ID, Exam Date and Gender are required." });
    }
    const newRecord = healthDataModel.addHealthData(data);
    res.status(201).json(newRecord);
});

router.put('/:id', authMiddleware, (req, res) => {
    const updatedData = req.body;
    // Log para verificar data_exame ao receber do frontend para PUT
    console.log(`Backend (Routes - PUT /:id): Recebido data_exame: ${updatedData.data_exame} (Type: ${typeof updatedData.data_exame})`);

    const record = healthDataModel.updateHealthData(req.params.id, updatedData);
    if (record) {
        return res.json(record);
    }
    res.status(404).json({ message: "Health data record not found." });
});

router.delete('/:id', authMiddleware, (req, res) => {
    if (healthDataModel.deleteHealthData(req.params.id)) {
        return res.status(200).json({ message: "Health data record deleted successfully" });
    }
    res.status(404).json({ message: "Health data record not found." });
});

module.exports = router;
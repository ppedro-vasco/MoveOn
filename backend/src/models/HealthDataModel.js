const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { calculateIsgScore, getIsgClassification, getIsgMessage } = require('../utils/isgCalculator');

const healthDataFilePath = path.join(__dirname, '../data/health_data.json');

class HealthDataModel {
    constructor() {
        this.healthData = this._loadData();
    }

    _loadData() {
        if (!fs.existsSync(healthDataFilePath)) {
            return [];
        }
        const data = fs.readFileSync(healthDataFilePath, 'utf8');
        const parsedData = JSON.parse(data);
        // Log para verificar data_exame ao carregar do JSON
        parsedData.forEach((record, index) => {
            console.log(`Backend (Model - _loadData): Record ${index} ID: ${record.id}, data_exame: ${record.data_exame} (Type: ${typeof record.data_exame})`);
        });
        return parsedData;
    }

    _saveData() {
        fs.writeFileSync(healthDataFilePath, JSON.stringify(this.healthData, null, 4), 'utf8');
    }

    _enrichRecord(record) {
        const isgScore = calculateIsgScore(record);
        const { classification, score_level } = getIsgClassification(isgScore);
        const message = getIsgMessage(classification, score_level);
        return {
            ...record,
            isg_score_total: isgScore,
            isg_classification: classification,
            isg_score_level: score_level,
            isg_message: message
        };
    }

    getAllHealthData() {
        return this.healthData.map(record => this._enrichRecord(record));
    }

    getHealthDataById(id) {
        const record = this.healthData.find(data => data.id === id);
        return record ? this._enrichRecord(record) : null;
    }

    getHealthDataByUserId(userId) {
        const userRecords = this.healthData.filter(data => data.user_id === userId);
        return userRecords.map(record => this._enrichRecord(record));
    }

    addHealthData(data) {
        const dataToSave = { ...data };
        if (dataToSave.data_exame !== undefined && dataToSave.data_exame !== null) {
            dataToSave.data_exame = String(dataToSave.data_exame).split('T')[0];
        }

        const newRecord = { id: uuidv4(), ...dataToSave };
        this.healthData.push(newRecord);
        this._saveData();
        return this._enrichRecord(newRecord);
    }

    updateHealthData(id, updatedData) {
        const index = this.healthData.findIndex(record => record.id === id);
        if (index !== -1) {
            if (updatedData.data_exame !== undefined && updatedData.data_exame !== null) {
                updatedData.data_exame = String(updatedData.data_exame).split('T')[0];
            }

            this.healthData[index] = { ...this.healthData[index], ...updatedData };
            this._saveData();
            return this._enrichRecord(this.healthData[index]);
        }
        return null;
    }

    deleteHealthData(id) {
        const initialLength = this.healthData.length;
        this.healthData = this.healthData.filter(record => record.id !== id);
        if (this.healthData.length < initialLength) {
            this._saveData();
            return true;
        }
        return false;
    }
}

module.exports = new HealthDataModel();
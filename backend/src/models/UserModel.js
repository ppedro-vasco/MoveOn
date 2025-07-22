const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos

const usersFilePath = path.join(__dirname, '../data/users.json');

class UserModel {
    constructor() {
        this.users = this._loadData();
    }

    _loadData() {
        if (!fs.existsSync(usersFilePath)) {
            return [];
        }
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    }

    _saveData() {
        fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 4), 'utf8');
    }

    getAllUsers() {
        return this.users;
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    addUser(userData) {
        const newUser = { id: uuidv4(), ...userData }; // Gera um ID único
        this.users.push(newUser);
        this._saveData();
        return newUser;
    }

    updateUser(id, updatedData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            // Garante que a senha só seja atualizada se fornecida
            if (updatedData.password === '') {
                delete updatedData.password;
            }
            this.users[index] = { ...this.users[index], ...updatedData };
            this._saveData();
            return this.users[index];
        }
        return null;
    }

    deleteUser(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        if (this.users.length < initialLength) {
            this._saveData();
            return true;
        }
        return false;
    }
}

module.exports = new UserModel();
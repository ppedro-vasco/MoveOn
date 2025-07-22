const fs = require('fs');
const path = require('path');

const ingredientesFilePath = path.join(__dirname, '../data/ingredientes.json');

class RestaurantModel {
    constructor() {
        this.ingredientes = this._loadIngredientes();
        // Futuramente, outros dados como cardápios semanais podem ser carregados aqui
        // this.cardapios = this._loadCardapios();
    }

    _loadIngredientes() {
        if (!fs.existsSync(ingredientesFilePath)) {
            console.warn('ingredientes.json not found. Returning empty array.');
            return [];
        }
        const data = fs.readFileSync(ingredientesFilePath, 'utf8');
        return JSON.parse(data);
    }

    // Métodos para Cardápios e Encomendas seriam adicionados aqui
    // _loadCardapios() { ... }
    // _saveCardapios() { ... }
    // addCardapio(cardapioData) { ... }
    // getCardapioSemanal() { ... }
    // addEncomenda(encomendaData) { ... }


    getIngredientes() {
        return this.ingredientes;
    }

    getIngredienteById(id) {
        return this.ingredientes.find(ing => ing.id === id);
    }

    // Métodos de CRUD para ingredientes seriam adicionados aqui se o admin puder gerenciar
    // addIngrediente(ingredienteData) { ... }
    // updateIngrediente(id, updatedData) { ... }
    // deleteIngrediente(id) { ... }
}

module.exports = new RestaurantModel();
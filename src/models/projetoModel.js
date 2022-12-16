const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    finalidade: {
        type: String,
        required: true
    },
    responsavel: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('projeto', projetoSchema);
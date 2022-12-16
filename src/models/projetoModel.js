const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: false
    },
    finalidade: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    responsavel: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('projeto', projetoSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: false
    },
    cpf: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('user', userSchema);
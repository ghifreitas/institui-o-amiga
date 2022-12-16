const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
    capacidade: {
        type: Number,
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('mesa', mesaSchema);
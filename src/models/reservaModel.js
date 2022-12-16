const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    numeroDaMesa: {
        type: Number,
        required: true
    },
    quantidadeDePessoas: {
        type: Number,
        required: true
    },
    horarioInicio: {
        type: Date,
        required: true
    },
    horarioFim: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ATIVA', 'CANCELADA'],
        default: 'ATIVA',
        required: true
    },
    responsavel: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('reserva', reservaSchema);
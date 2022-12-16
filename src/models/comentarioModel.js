const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    projeto: {
        type: String,
        required: true
    },
    sugestao: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('comentario', comentarioSchema);
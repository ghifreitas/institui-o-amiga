require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const database = require('./database/mongooseConnect');
const usuarioRoutes = require('./routes/usuarioRoutes');
// const projetoRoutes = require('./routes/projetoRoutes');
// const comentarioRoutes = require('./routes/comentarioRoutes');

app.use(cors());
app.use(express.json());

app.use("/usuario", usuarioRoutes)
// app.use("/projeto", projetoRoutes)
// app.use("/comentario", comentarioRoutes)

database.connect();

module.exports = app;
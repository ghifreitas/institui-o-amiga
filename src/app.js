require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const database = require('./database/mongooseConnect');
const usuarioRoutes = require('./routes/usuarioRoutes');
const mesaRoutes = require('./routes/mesaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

app.use(cors());
app.use(express.json());

app.use("/usuario", usuarioRoutes)
app.use("/mesa", mesaRoutes)
app.use("/reserva", reservaRoutes)

database.connect();

module.exports = app;
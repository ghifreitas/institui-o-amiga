const express = require('express');
const router = express.Router();

const controller = require('../controllers/comentarioController');

const { checkAuth } = require("../middlewares/auth");

// router.post("/criar", checkAuth, checaAcessoCliente, controller.criarReservaCliente);
// router.post("/criar_para_cliente", checkAuth, checaAcessoGerente, controller.criarReservaGerente);
// router.post("/checar_disponibilidade", checkAuth, controller.checarMesasRequest);
// router.get("/listar", checkAuth, checaAcessoGerente, controller.listarReservas);
// router.get("/listar_reserva_cliente", checkAuth, checaAcessoCliente, controller.listarReservasCliente);
// router.patch("/atualizar/:id", checkAuth, checaAcessoGerente, controller.atualizarReservaGerente);
// router.patch("/atualizar_cliente/:id", checkAuth, checaAcessoCliente, controller.atualizarReservaCliente);
// router.delete("/cancelar/:id", checkAuth, checaAcessoGerente, controller.cancelarReserva);
// router.delete("/cancelar_cliente/:id", checkAuth, checaAcessoCliente, controller.cancelarReservaCliente);



module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../controllers/mesaController');

const { checkAuth, checaAcessoGerente } = require("../middlewares/auth");

// gerente
router.post("/criar", checkAuth, checaAcessoGerente, controller.criarMesa);
router.get("/listar", checkAuth, checaAcessoGerente, controller.listarMesas);
router.patch("/atualizar/:numero", checkAuth, checaAcessoGerente, controller.atualizarMesa);
router.delete("/remover/:numero", checkAuth, checaAcessoGerente, controller.removerMesa);



module.exports = router;
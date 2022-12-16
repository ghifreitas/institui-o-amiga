const express = require('express');
const router = express.Router();

const controller = require('../controllers/projetoController');

const { checkAuth} = require("../middlewares/auth");

// gerente
router.post("/criar", checkAuth, controller.criarProjeto);
router.get("/listar", controller.listarProjetos);
router.patch("/atualizar/:id", checkAuth, controller.atualizarProjeto);
router.get("/ver/:id", checkAuth, controller.obterProjetoPorId);
router.delete("/remover/:id", checkAuth, controller.removerProjeto);



module.exports = router;
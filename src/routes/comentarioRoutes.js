const express = require('express');
const router = express.Router();

const controller = require('../controllers/comentarioController');

const { checkAuth } = require("../middlewares/auth");

router.post("/criar", checkAuth, controller.criarComentario);
router.get("/listar", controller.listarComentarios);
router.patch("/atualizar/:id", checkAuth, controller.atualizarComentario);
router.delete("/remover/:id", checkAuth, controller.removerComentario);

module.exports = router;
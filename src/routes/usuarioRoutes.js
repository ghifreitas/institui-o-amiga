const express = require('express');
const router = express.Router();

const controller = require('../controllers/mesaController');
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const { checkAuth, checaAcessoGerente } = require("../middlewares/auth");

router.post("/criar_cliente/", checkAuth, userController.createCliente);
router.post("/criar_gerente/", checkAuth, checaAcessoGerente, userController.createGerente);
router.get("/listar/", checkAuth, checaAcessoGerente, userController.getAll);
router.post("/login/", authController.login);

module.exports = router;
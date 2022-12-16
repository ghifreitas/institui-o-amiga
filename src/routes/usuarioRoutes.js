const express = require('express');
const router = express.Router();

const controller = require('../controllers/comentarioController');
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const { checkAuth, checaAcessoGerente } = require("../middlewares/auth");

router.post("/criar/", userController.criarUsuario);
router.post("/login/", authController.login);

module.exports = router;
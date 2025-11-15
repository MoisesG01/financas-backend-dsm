const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
router.post('/cadastrar', UsuarioController.cadastrar);
router.post('/login', UsuarioController.login);

// Rotas protegidas (precisam de autenticação)
router.get('/perfil', authMiddleware, UsuarioController.perfil);
router.put('/atualizar', authMiddleware, UsuarioController.atualizar);
router.delete('/deletar', authMiddleware, UsuarioController.deletar);

module.exports = router;


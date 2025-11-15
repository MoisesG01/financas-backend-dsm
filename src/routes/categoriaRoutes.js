const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.post('/', authMiddleware, CategoriaController.criar);
router.get('/', authMiddleware, CategoriaController.listar);
router.get('/:id', authMiddleware, CategoriaController.buscarPorId);
router.put('/:id', authMiddleware, CategoriaController.atualizar);
router.delete('/:id', authMiddleware, CategoriaController.deletar);

module.exports = router;


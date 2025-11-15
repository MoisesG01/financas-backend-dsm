const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/transacaoController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.post('/', authMiddleware, TransacaoController.criar);
router.get('/', authMiddleware, TransacaoController.listar);
router.get('/resumo', authMiddleware, TransacaoController.resumo);
router.get('/:id', authMiddleware, TransacaoController.buscarPorId);
router.put('/:id', authMiddleware, TransacaoController.atualizar);
router.delete('/:id', authMiddleware, TransacaoController.deletar);

module.exports = router;


const Categoria = require('../models/Categoria');

class CategoriaController {
  // Criar nova categoria
  static async criar(req, res) {
    try {
      const { nome, tipo } = req.body;
      const idUsuario = req.usuarioId;

      // Validações
      if (!nome || !tipo) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome e tipo' 
        });
      }

      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ 
          erro: 'Tipo deve ser "receita" ou "despesa"' 
        });
      }

      const id = await Categoria.criar(nome, tipo, idUsuario);
      const categoria = await Categoria.buscarPorId(id, idUsuario);

      res.status(201).json({
        mensagem: 'Categoria criada com sucesso!',
        categoria
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar categoria' });
    }
  }

  // Listar todas as categorias do usuário
  static async listar(req, res) {
    try {
      const idUsuario = req.usuarioId;
      const categorias = await Categoria.buscarPorUsuario(idUsuario);

      res.json(categorias);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar categorias' });
    }
  }

  // Buscar categoria por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const idUsuario = req.usuarioId;

      const categoria = await Categoria.buscarPorId(id, idUsuario);

      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      res.json(categoria);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar categoria' });
    }
  }

  // Atualizar categoria
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, tipo } = req.body;
      const idUsuario = req.usuarioId;

      // Validações
      if (!nome || !tipo) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome e tipo' 
        });
      }

      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ 
          erro: 'Tipo deve ser "receita" ou "despesa"' 
        });
      }

      // Verificar se categoria existe e pertence ao usuário
      const categoria = await Categoria.buscarPorId(id, idUsuario);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      await Categoria.atualizar(id, nome, tipo, idUsuario);
      const categoriaAtualizada = await Categoria.buscarPorId(id, idUsuario);

      res.json({
        mensagem: 'Categoria atualizada com sucesso!',
        categoria: categoriaAtualizada
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar categoria' });
    }
  }

  // Deletar categoria
  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const idUsuario = req.usuarioId;

      // Verificar se categoria existe e pertence ao usuário
      const categoria = await Categoria.buscarPorId(id, idUsuario);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      await Categoria.deletar(id, idUsuario);

      res.json({ mensagem: 'Categoria deletada com sucesso!' });
    } catch (error) {
      if (error.message === 'Não é possível deletar categoria que possui transações') {
        return res.status(400).json({ erro: error.message });
      }
      res.status(500).json({ erro: 'Erro ao deletar categoria' });
    }
  }
}

module.exports = CategoriaController;


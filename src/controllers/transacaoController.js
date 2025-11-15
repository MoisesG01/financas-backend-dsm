const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

class TransacaoController {
  // Criar nova transação
  static async criar(req, res) {
    try {
      const { descricao, valor, data, tipo, id_categoria } = req.body;
      const idUsuario = req.usuarioId;

      // Validações
      if (!descricao || !valor || !data || !tipo || !id_categoria) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: descricao, valor, data, tipo e id_categoria' 
        });
      }

      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ 
          erro: 'Tipo deve ser "receita" ou "despesa"' 
        });
      }

      if (valor <= 0) {
        return res.status(400).json({ 
          erro: 'O valor deve ser maior que zero' 
        });
      }

      // Verificar se categoria existe e pertence ao usuário
      const categoria = await Categoria.buscarPorId(id_categoria, idUsuario);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      // Verificar se tipo da categoria corresponde ao tipo da transação
      if (categoria.tipo !== tipo) {
        return res.status(400).json({ 
          erro: `A categoria "${categoria.nome}" é do tipo "${categoria.tipo}", mas a transação é do tipo "${tipo}"` 
        });
      }

      const id = await Transacao.criar(descricao, valor, data, tipo, id_categoria, idUsuario);
      const transacao = await Transacao.buscarPorId(id, idUsuario);

      res.status(201).json({
        mensagem: 'Transação criada com sucesso!',
        transacao
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar transação' });
    }
  }

  // Listar todas as transações do usuário
  static async listar(req, res) {
    try {
      const idUsuario = req.usuarioId;
      const { tipo, data_inicio, data_fim, id_categoria } = req.query;

      const filtros = {};
      if (tipo) filtros.tipo = tipo;
      if (data_inicio) filtros.dataInicio = data_inicio;
      if (data_fim) filtros.dataFim = data_fim;
      if (id_categoria) filtros.idCategoria = id_categoria;

      const transacoes = await Transacao.buscarPorUsuario(idUsuario, filtros);

      res.json(transacoes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar transações' });
    }
  }

  // Buscar transação por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const idUsuario = req.usuarioId;

      const transacao = await Transacao.buscarPorId(id, idUsuario);

      if (!transacao) {
        return res.status(404).json({ erro: 'Transação não encontrada' });
      }

      res.json(transacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar transação' });
    }
  }

  // Atualizar transação
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, valor, data, tipo, id_categoria } = req.body;
      const idUsuario = req.usuarioId;

      // Validações
      if (!descricao || !valor || !data || !tipo || !id_categoria) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: descricao, valor, data, tipo e id_categoria' 
        });
      }

      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ 
          erro: 'Tipo deve ser "receita" ou "despesa"' 
        });
      }

      if (valor <= 0) {
        return res.status(400).json({ 
          erro: 'O valor deve ser maior que zero' 
        });
      }

      // Verificar se transação existe e pertence ao usuário
      const transacao = await Transacao.buscarPorId(id, idUsuario);
      if (!transacao) {
        return res.status(404).json({ erro: 'Transação não encontrada' });
      }

      // Verificar se categoria existe e pertence ao usuário
      const categoria = await Categoria.buscarPorId(id_categoria, idUsuario);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      // Verificar se tipo da categoria corresponde ao tipo da transação
      if (categoria.tipo !== tipo) {
        return res.status(400).json({ 
          erro: `A categoria "${categoria.nome}" é do tipo "${categoria.tipo}", mas a transação é do tipo "${tipo}"` 
        });
      }

      await Transacao.atualizar(id, descricao, valor, data, tipo, id_categoria, idUsuario);
      const transacaoAtualizada = await Transacao.buscarPorId(id, idUsuario);

      res.json({
        mensagem: 'Transação atualizada com sucesso!',
        transacao: transacaoAtualizada
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar transação' });
    }
  }

  // Deletar transação
  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const idUsuario = req.usuarioId;

      // Verificar se transação existe e pertence ao usuário
      const transacao = await Transacao.buscarPorId(id, idUsuario);
      if (!transacao) {
        return res.status(404).json({ erro: 'Transação não encontrada' });
      }

      await Transacao.deletar(id, idUsuario);

      res.json({ mensagem: 'Transação deletada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar transação' });
    }
  }

  // Buscar resumo financeiro
  static async resumo(req, res) {
    try {
      const idUsuario = req.usuarioId;
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: data_inicio e data_fim (formato: YYYY-MM-DD)' 
        });
      }

      const resumo = await Transacao.buscarResumo(idUsuario, data_inicio, data_fim);

      res.json(resumo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar resumo' });
    }
  }
}

module.exports = TransacaoController;


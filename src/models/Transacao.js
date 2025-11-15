const pool = require('../config/database');

class Transacao {
  // Criar nova transação
  static async criar(descricao, valor, data, tipo, idCategoria, idUsuario) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO transacoes (descricao, valor, data, tipo, id_categoria, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [descricao, valor, data, tipo, idCategoria, idUsuario]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as transações de um usuário
  static async buscarPorUsuario(idUsuario, filtros = {}) {
    try {
      let query = 'SELECT t.*, c.nome as categoria_nome FROM transacoes t INNER JOIN categorias c ON t.id_categoria = c.id_categoria WHERE t.id_usuario = ?';
      const params = [idUsuario];

      if (filtros.tipo) {
        query += ' AND t.tipo = ?';
        params.push(filtros.tipo);
      }

      if (filtros.dataInicio) {
        query += ' AND t.data >= ?';
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        query += ' AND t.data <= ?';
        params.push(filtros.dataFim);
      }

      if (filtros.idCategoria) {
        query += ' AND t.id_categoria = ?';
        params.push(filtros.idCategoria);
      }

      query += ' ORDER BY t.data DESC, t.data_criacao DESC';

      const [transacoes] = await pool.execute(query, params);
      return transacoes;
    } catch (error) {
      throw error;
    }
  }

  // Buscar transação por ID
  static async buscarPorId(id, idUsuario) {
    try {
      const [transacoes] = await pool.execute(
        `SELECT t.*, c.nome as categoria_nome 
         FROM transacoes t 
         INNER JOIN categorias c ON t.id_categoria = c.id_categoria 
         WHERE t.id_transacao = ? AND t.id_usuario = ?`,
        [id, idUsuario]
      );
      return transacoes[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar transação
  static async atualizar(id, descricao, valor, data, tipo, idCategoria, idUsuario) {
    try {
      await pool.execute(
        'UPDATE transacoes SET descricao = ?, valor = ?, data = ?, tipo = ?, id_categoria = ? WHERE id_transacao = ? AND id_usuario = ?',
        [descricao, valor, data, tipo, idCategoria, id, idUsuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar transação
  static async deletar(id, idUsuario) {
    try {
      await pool.execute(
        'DELETE FROM transacoes WHERE id_transacao = ? AND id_usuario = ?',
        [id, idUsuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Buscar resumo financeiro
  static async buscarResumo(idUsuario, dataInicio, dataFim) {
    try {
      const [resultado] = await pool.execute(
        `SELECT 
          tipo,
          SUM(valor) as total
         FROM transacoes 
         WHERE id_usuario = ? AND data >= ? AND data <= ?
         GROUP BY tipo`,
        [idUsuario, dataInicio, dataFim]
      );

      const resumo = {
        receitas: 0,
        despesas: 0,
        saldo: 0
      };

      resultado.forEach(item => {
        if (item.tipo === 'receita') {
          resumo.receitas = parseFloat(item.total) || 0;
        } else {
          resumo.despesas = parseFloat(item.total) || 0;
        }
      });

      resumo.saldo = resumo.receitas - resumo.despesas;

      return resumo;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Transacao;


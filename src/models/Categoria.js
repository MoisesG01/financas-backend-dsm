const pool = require('../config/database');

class Categoria {
  // Criar nova categoria
  static async criar(nome, tipo, idUsuario) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO categorias (nome, tipo, id_usuario) VALUES (?, ?, ?)',
        [nome, tipo, idUsuario]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as categorias de um usuário
  static async buscarPorUsuario(idUsuario) {
    try {
      const [categorias] = await pool.execute(
        'SELECT * FROM categorias WHERE id_usuario = ? ORDER BY nome',
        [idUsuario]
      );
      return categorias;
    } catch (error) {
      throw error;
    }
  }

  // Buscar categoria por ID
  static async buscarPorId(id, idUsuario) {
    try {
      const [categorias] = await pool.execute(
        'SELECT * FROM categorias WHERE id_categoria = ? AND id_usuario = ?',
        [id, idUsuario]
      );
      return categorias[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar categoria
  static async atualizar(id, nome, tipo, idUsuario) {
    try {
      await pool.execute(
        'UPDATE categorias SET nome = ?, tipo = ? WHERE id_categoria = ? AND id_usuario = ?',
        [nome, tipo, id, idUsuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar categoria
  static async deletar(id, idUsuario) {
    try {
      // Verificar se categoria tem transações
      const [transacoes] = await pool.execute(
        'SELECT COUNT(*) as total FROM transacoes WHERE id_categoria = ?',
        [id]
      );

      if (transacoes[0].total > 0) {
        throw new Error('Não é possível deletar categoria que possui transações');
      }

      await pool.execute(
        'DELETE FROM categorias WHERE id_categoria = ? AND id_usuario = ?',
        [id, idUsuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Categoria;


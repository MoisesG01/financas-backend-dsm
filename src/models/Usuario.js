const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Usuario {
  // Criar novo usuário
  static async criar(nome, email, senha) {
    try {
      // Verificar se email já existe
      const [existe] = await pool.execute(
        "SELECT id_usuario FROM usuarios WHERE email = ?",
        [email]
      );

      if (existe.length > 0) {
        throw new Error("Email já cadastrado");
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Inserir usuário
      const [result] = await pool.execute(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senhaHash]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      const [usuarios] = await pool.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      return usuarios[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async buscarPorId(id) {
    try {
      const [usuarios] = await pool.execute(
        "SELECT id_usuario, nome, email, data_criacao FROM usuarios WHERE id_usuario = ?",
        [id]
      );
      return usuarios[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Verificar senha
  static async verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }

  // Gerar token JWT
  static gerarToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  }

  // Atualizar usuário
  static async atualizar(id, nome, email) {
    try {
      // Verificar se email já existe em outro usuário
      const [existe] = await pool.execute(
        "SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?",
        [email, id]
      );

      if (existe.length > 0) {
        throw new Error("Email já cadastrado");
      }

      await pool.execute(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?",
        [nome, email, id]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário
  static async deletar(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Deletar todas as transações do usuário primeiro
      await connection.execute("DELETE FROM transacoes WHERE id_usuario = ?", [
        id,
      ]);

      // 2. Deletar todas as categorias do usuário (agora que não há transações)
      await connection.execute("DELETE FROM categorias WHERE id_usuario = ?", [
        id,
      ]);

      // 3. Por fim, deletar o usuário
      const [result] = await connection.execute(
        "DELETE FROM usuarios WHERE id_usuario = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Usuário não encontrado");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Usuario;

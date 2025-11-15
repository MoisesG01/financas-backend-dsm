const Usuario = require("../models/Usuario");

class UsuarioController {
  // Cadastrar novo usuário
  static async cadastrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Validações
      if (!nome || !email || !senha) {
        return res.status(400).json({
          erro: "Campos obrigatórios: nome, email e senha",
        });
      }

      if (senha.length < 6) {
        return res.status(400).json({
          erro: "A senha deve ter no mínimo 6 caracteres",
        });
      }

      const id = await Usuario.criar(nome, email, senha);
      const usuario = await Usuario.buscarPorId(id);

      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario,
      });
    } catch (error) {
      if (error.message === "Email já cadastrado") {
        return res.status(409).json({ erro: error.message });
      }
      res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      const usuario = await Usuario.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: "Email ou senha inválidos" });
      }

      const senhaValida = await Usuario.verificarSenha(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: "Email ou senha inválidos" });
      }

      const token = Usuario.gerarToken(usuario.id_usuario);

      res.json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao fazer login" });
    }
  }

  // Buscar perfil do usuário logado
  static async perfil(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuarioId);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar perfil" });
    }
  }

  // Atualizar usuário
  static async atualizar(req, res) {
    try {
      const { nome, email } = req.body;

      if (!nome || !email) {
        return res.status(400).json({
          erro: "Nome e email são obrigatórios",
        });
      }

      await Usuario.atualizar(req.usuarioId, nome, email);
      const usuario = await Usuario.buscarPorId(req.usuarioId);

      res.json({
        mensagem: "Usuário atualizado com sucesso!",
        usuario,
      });
    } catch (error) {
      if (error.message === "Email já cadastrado") {
        return res.status(409).json({ erro: error.message });
      }
      res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  }

  // Deletar usuário
  static async deletar(req, res) {
    try {
      // Verificar se usuário existe antes de deletar
      const usuario = await Usuario.buscarPorId(req.usuarioId);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      await Usuario.deletar(req.usuarioId);
      res.json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({
        erro: "Erro ao deletar usuário",
        detalhes:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = UsuarioController;

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        erro: 'Token não fornecido. Faça login para continuar.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id; // Adiciona o ID do usuário na requisição
    next();
  } catch (error) {
    return res.status(401).json({ 
      erro: 'Token inválido ou expirado.' 
    });
  }
};

module.exports = authMiddleware;


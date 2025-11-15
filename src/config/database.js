const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'financas_pessoais',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexão com o banco de dados estabelecida!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco de dados:', err.message);
  });

module.exports = pool;


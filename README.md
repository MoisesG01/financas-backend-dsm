# Backend - Sistema de Finanças Pessoais

API REST desenvolvida em Node.js com Express.js para gerenciamento de finanças pessoais.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Cliente MySQL
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Variáveis de ambiente
- **cors** - Controle de acesso CORS

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuração do banco de dados
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── categoriaController.js
│   │   └── transacaoController.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Categoria.js
│   │   └── Transacao.js
│   ├── routes/
│   │   ├── usuarioRoutes.js
│   │   ├── categoriaRoutes.js
│   │   └── transacaoRoutes.js
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticação
│   └── server.js             # Arquivo principal
├── .env.example              # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=financas_pessoais
DB_PORT=3306

JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

PORT=3000
```

### 3. Criar o banco de dados

Execute o script SQL em `../database.sql` para criar as tabelas.

### 4. Iniciar o servidor

**Desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### 🔐 Autenticação

#### Cadastrar Usuário
```
POST /api/usuarios/cadastrar
Body: { "nome": "João", "email": "joao@email.com", "senha": "123456" }
```

#### Login
```
POST /api/usuarios/login
Body: { "email": "joao@email.com", "senha": "123456" }
Response: { "token": "...", "usuario": {...} }
```

### 👤 Usuários (Requer autenticação)

- `GET /api/usuarios/perfil` - Buscar perfil do usuário logado
- `PUT /api/usuarios/atualizar` - Atualizar usuário
- `DELETE /api/usuarios/deletar` - Deletar usuário

### 📂 Categorias (Requer autenticação)

- `POST /api/categorias` - Criar categoria
- `GET /api/categorias` - Listar todas as categorias do usuário
- `GET /api/categorias/:id` - Buscar categoria por ID
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

**Exemplo de criação:**
```json
{
  "nome": "Alimentação",
  "tipo": "despesa"
}
```

### 💰 Transações (Requer autenticação)

- `POST /api/transacoes` - Criar transação
- `GET /api/transacoes` - Listar transações (com filtros opcionais)
- `GET /api/transacoes/resumo?data_inicio=2024-01-01&data_fim=2024-01-31` - Resumo financeiro
- `GET /api/transacoes/:id` - Buscar transação por ID
- `PUT /api/transacoes/:id` - Atualizar transação
- `DELETE /api/transacoes/:id` - Deletar transação

**Exemplo de criação:**
```json
{
  "descricao": "Supermercado",
  "valor": 350.50,
  "data": "2024-01-15",
  "tipo": "despesa",
  "id_categoria": 3
}
```

**Filtros na listagem:**
- `?tipo=receita` ou `?tipo=despesa`
- `?data_inicio=2024-01-01`
- `?data_fim=2024-01-31`
- `?id_categoria=3`

## 🔒 Autenticação

A maioria dos endpoints requer autenticação via JWT. Para usar:

1. Faça login em `/api/usuarios/login`
2. Copie o `token` retornado
3. Adicione no header das requisições:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

## 📝 Exemplos de Uso

### Criar categoria e transação

```bash
# 1. Login
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# 2. Criar categoria (usar token do login)
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nome":"Alimentação","tipo":"despesa"}'

# 3. Criar transação
curl -X POST http://localhost:3000/api/transacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "descricao":"Supermercado",
    "valor":350.50,
    "data":"2024-01-15",
    "tipo":"despesa",
    "id_categoria":3
  }'
```

## 🧪 Testando com Insomnia/Postman

1. Importe as rotas ou crie manualmente
2. Configure a variável de ambiente `token` após fazer login
3. Use `{{token}}` nos headers de autenticação

## ⚠️ Observações

- As senhas são hasheadas com bcrypt antes de serem salvas
- Cada usuário só acessa suas próprias categorias e transações
- Não é possível deletar uma categoria que possui transações
- O tipo da transação deve corresponder ao tipo da categoria


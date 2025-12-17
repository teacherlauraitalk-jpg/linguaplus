const express = require('express');
const path = require('path');
const session = require('express-session');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para processar formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sessões
app.use(session({
  secret: 'linguaplussecret', 
  resave: false,
  saveUninitialized: true
}));

// Middleware para proteger rotas
function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Processar login
app.post('/login', async (req, res) => {
  const { email, senha, idioma } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM alunos WHERE email=$1 AND senha=$2 AND idioma=$3',
      [email, senha, idioma]
    );

    if (result.rows.length > 0) {
      req.session.user = {
        id: result.rows[0].id,
        nome: result.rows[0].nome,
        idioma: result.rows[0].idioma
      };
      res.redirect('/cursos');
    } else {
      res.send('Email, senha ou idioma incorreto!');
    }
  } catch (err) {
    console.error(err);
    res.send('Erro ao processar login.');
  }
});

// Página de inscrição
app.get('/inscricao', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inscricao.html'));
});

// Processar inscrição
app.post('/inscrever', async (req, res) => {
  const { nome, email, senha, idioma } = req.body;

  try {
    // Verifica se o email já existe
    const check = await pool.query('SELECT * FROM alunos WHERE email=$1', [email]);
    if (check.rows.length > 0) return res.send('Email já cadastrado');

    // Insere novo aluno
    await pool.query(
      'INSERT INTO alunos (nome, email, senha, idioma) VALUES ($1, $2, $3, $4)',
      [nome, email, senha, idioma]
    );

    // Login automático
    const result = await pool.query(
      'SELECT * FROM alunos WHERE email=$1 AND senha=$2',
      [email, senha]
    );

    req.session.user = {
      id: result.rows[0].id,
      nome: result.rows[0].nome,
      idioma: result.rows[0].idioma
    };

    res.redirect('/cursos');
  } catch (err) {
    console.error(err);
    res.send('Erro ao criar a conta.');
  }
});

// Página de cursos (só para alunos logados)
app.get('/cursos', auth, (req, res) => {
  const idioma = req.session.user.idioma;

  if (idioma === 'ingles') return res.sendFile(path.join(__dirname, 'public', 'cursos-ingles.html'));
  if (idioma === 'espanhol') return res.sendFile(path.join(__dirname, 'public', 'cursos-espanhol.html'));
  if (idioma === 'frances') return res.sendFile(path.join(__dirname, 'public', 'cursos-frances.html'));

  res.send('Idioma não encontrado');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

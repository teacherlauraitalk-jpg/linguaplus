const express = require('express');
const path = require('path');

const app = express();

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor ligado na porta 3000');
});






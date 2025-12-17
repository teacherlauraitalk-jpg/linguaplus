const { Pool } = require('pg');

const pool = new Pool({
    user: 'linguser',          // seu usuário do PostgreSQL
    host: 'localhost',          // geralmente localhost
    database: 'linguaplus',     // nome do banco
    password: '',               // coloque a senha do linguser se houver
    port: 5432                  // porta padrão do PostgreSQL
});

module.exports = pool;


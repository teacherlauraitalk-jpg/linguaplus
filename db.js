const { Pool } = require('pg');

const pool = new Pool({
    user: 'linguser',        // seu usuário PostgreSQL
    host: 'localhost',
    database: 'linguaplus',
    password: '',            // coloque a senha se houver
    port: 5432
});

module.exports = pool;
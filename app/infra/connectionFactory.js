const mysql = require('mysql2');

module.exports = function () {
    if (process.env.RENDER) {
        return mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'hotel',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            connectTimeout: 10000
        });
    }

    // Se estiver local, usa o banco do Laragon.
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'hotel'
    });
};
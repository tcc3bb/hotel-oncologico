const mysql = require('mysql2');

module.exports = function () {
    // Ambiente de produção (Render)
    if (process.env.RENDER) {
        return mysql.createConnection({
            host: process.env.DB_HOST,       // maglev.proxy.rlwy.net
            user: process.env.DB_USER,       // root
            password: process.env.DB_PASS,   // senha gigante
            database: process.env.DB_NAME,   // railway
            port: Number(process.env.DB_PORT), // porta tipo 14468
            connectTimeout: 15000
        });
    }

    // Ambiente local (Laragon / XAMPP)
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'hotel',
        port: 3306
    });
};

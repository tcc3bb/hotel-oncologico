var mysql = require('mysql2');

module.exports = function () {
    return mysql.createConnection({
        host: process.env.DB_HOST || 'switchback.proxy.rlwy.net',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'aMMHZfHXBatNlkjOObUGbMzyPNEXjFqn',
        database: process.env.DB_NAME || 'hotel', 
        port: process.env.DB_PORT || 51074
    });
};

module.exports = function () {
    return connectMYSQL();
}

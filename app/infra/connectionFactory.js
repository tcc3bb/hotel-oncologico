var mysql = require('mysql2');

var connectMYSQL = function(){
    return mysql.createConnection({
        host: 'localhost',
        database: 'hotel',
        user: 'root',
        password: ''
    });
}

module.exports = function(){
    return connectMYSQL();  
}

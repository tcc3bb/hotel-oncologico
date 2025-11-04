class ConteudoDAO {
    constructor(connection) {
        this._connection = connection;
    }

    listar(callback) {
        this._connection.query('SELECT * FROM conteudos ORDER BY data_criacao DESC', callback);
    }

    salvar(titulo, tipo, status, callback) {
        const sql = 'INSERT INTO conteudos (titulo, tipo, status) VALUES (?, ?, ?)';
        this._connection.query(sql, [titulo, tipo, status], callback);
    }

    atualizar(id, titulo, tipo, status, callback) {
        const sql = 'UPDATE conteudos SET titulo=?, tipo=?, status=? WHERE id=?';
        this._connection.query(sql, [titulo, tipo, status, id], callback);
    }

    excluir(id, callback) {
        this._connection.query('DELETE FROM conteudos WHERE id=?', [id], callback);
    }
}

module.exports = ConteudoDAO;

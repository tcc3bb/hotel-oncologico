class DoadorDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
            SELECT 
                d.*, 
                u.usuario_id, u.usuario_email, u.usuario_tipo, u.usuario_senha
            FROM doador d
            JOIN usuario u ON d.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
        `;
        this._connection.query(sql, [usuarioId], callback);
    }

    buscarPorUsuarioId(usuarioId, callback) {
        this._connection.query('SELECT * FROM doador WHERE usuario_id = ?', [usuarioId], callback);
    }

    atualizarDoador(id, dados, callback) {
        this._connection.query('UPDATE doador SET ? WHERE doador_id = ?', [dados, id], callback);
    }

    excluirConta(usuarioId, callback) {
        this._connection.query('DELETE FROM usuario WHERE usuario_id = ?', [usuarioId], callback);
    }
}

module.exports = DoadorDAO;

class AcompanhanteDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
            SELECT 
                a.*, 
                u.usuario_id, u.usuario_email, u.usuario_tipo, u.usuario_senha
            FROM acompanhante a
            JOIN usuario u ON a.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
        `;
        this._connection.query(sql, [usuarioId], callback);
    }

    buscarPorUsuarioId(usuarioId, callback) {
        this._connection.query('SELECT * FROM acompanhante WHERE usuario_id = ?', [usuarioId], callback);
    }

    atualizarAcompanhante(id, dados, callback) {
        this._connection.query('UPDATE acompanhante SET ? WHERE acompanhante_id = ?', [dados, id], callback);
    }

    excluirConta(usuarioId, callback) {
        this._connection.query('DELETE FROM usuario WHERE usuario_id = ?', [usuarioId], callback);
    }
}

module.exports = AcompanhanteDAO;

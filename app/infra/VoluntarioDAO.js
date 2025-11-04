class VoluntarioDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
            SELECT 
                v.*, 
                u.usuario_id, u.usuario_email, u.usuario_tipo, u.usuario_senha
            FROM voluntario v
            JOIN usuario u ON v.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
        `;
        this._connection.query(sql, [usuarioId], callback);
    }

    buscarPorUsuarioId(usuarioId, callback) {
        this._connection.query('SELECT * FROM voluntario WHERE usuario_id = ?', [usuarioId], callback);
    }

    atualizarVoluntario(id, dados, callback) {
        this._connection.query('UPDATE voluntario SET ? WHERE voluntario_id = ?', [dados, id], callback);
    }

    excluirConta(usuarioId, callback) {
        this._connection.query('DELETE FROM usuario WHERE usuario_id = ?', [usuarioId], callback);
    }
}

module.exports = VoluntarioDAO;

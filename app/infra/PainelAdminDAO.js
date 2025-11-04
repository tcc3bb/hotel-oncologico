class PainelAdminDAO {
    constructor(connection) {
        this._connection = connection;
    }

    // 🔹 Listar todos os usuários
    listarUsuarios(callback) {
        const sql = `
            SELECT 
                usuario_id,
                usuario_email AS email,
                usuario_tipo AS tipo,
                DATE_FORMAT(usuario_data_criacao, '%d/%m/%Y %H:%i:%s') AS data_criacao,
                DATE_FORMAT(usuario_ultimo_login, '%d/%m/%Y %H:%i:%s') AS ultimo_login,
                usuario_estado AS estado,
                usuario_foto_perfil AS foto_perfil
            FROM usuario
            ORDER BY usuario_data_criacao DESC
        `;
        this._connection.query(sql, callback);
    }

    // Buscar senha de um admin pelo ID
    getSenhaAdmin(usuario_id, callback) {
        const sql = 'SELECT usuario_senha FROM usuario WHERE usuario_id = ?';
        this._connection.query(sql, [usuario_id], callback);
    }

    // 🔹 Excluir usuário
    excluirUsuario(usuario_id, callback) {
        const sql = 'DELETE FROM usuario WHERE usuario_id = ?';
        this._connection.query(sql, [usuario_id], callback);
    }

    // 🔹 Atualizar usuário (sem solicitar e-mail)
    atualizarUsuario(usuario_id, tipo, estado, foto_perfil, callback) {
        let sql, params;
        if (foto_perfil) {
            sql = `
            UPDATE usuario 
            SET  usuario_tipo = ?, 
                usuario_estado = ?, 
                usuario_foto_perfil = ?
            WHERE usuario_id = ?
        `;
            params = [tipo, estado, foto_perfil, usuario_id];
        } else {
            sql = `
            UPDATE usuario 
            SET usuario_tipo = ?, 
                usuario_estado = ?
            WHERE usuario_id = ?
        `;
            params = [tipo, estado, usuario_id];
        }
        this._connection.query(sql, params, callback);
    }
}

module.exports = () => {
    return PainelAdminDAO;
};

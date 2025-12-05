function PasswordResetDAO(connection) {
    this._connection = connection;
}

// Inserção com usuario_id correto
PasswordResetDAO.prototype.salvar = function (obj, callback) {
    const data = {
        usuario_id: obj.user_id,   // user_id → usuario_id no BD
        token: obj.token,
        expires_at: obj.expires_at
    };

    this._connection.query(
        'INSERT INTO password_resets SET ?',
        data,
        callback
    );
};

// JOIN corrigido (tabela usuario, chave usuario_id)
PasswordResetDAO.prototype.buscarPorToken = function (token, callback) {
    this._connection.query(
        `SELECT pr.*, u.usuario_email AS email, u.usuario_id AS user_id
        FROM password_resets pr
        JOIN usuario u ON pr.usuario_id = u.usuario_id
        WHERE pr.token = ?`,
        [token],
        callback
    );
};



// Marca como usado
PasswordResetDAO.prototype.marcarComoUsado = function (token, callback) {
    this._connection.query(
        'UPDATE password_resets SET used = 1 WHERE token = ?',
        [token],
        callback
    );
};

module.exports = PasswordResetDAO;

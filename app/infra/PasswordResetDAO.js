function PasswordResetDAO(connection) {
    this._connection = connection;
}

PasswordResetDAO.prototype.salvar = function (obj, callback) {
    // obj = { user_id, token, expires_at } (expires_at = JS Date ou string MySQL)
    this._connection.query(
        'INSERT INTO password_resets SET ?',
        obj,
        callback
    );
};

PasswordResetDAO.prototype.buscarPorToken = function (token, callback) {
    this._connection.query(
        'SELECT pr.*, u.email, u.id as user_id FROM password_resets pr JOIN usuarios u ON pr.user_id = u.id WHERE pr.token = ?',
        [token],
        callback
    );
};

PasswordResetDAO.prototype.marcarComoUsado = function (token, callback) {
    this._connection.query(
        'UPDATE password_resets SET used = 1 WHERE token = ?',
        [token],
        callback
    );
};

module.exports = PasswordResetDAO;

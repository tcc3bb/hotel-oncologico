function UsuariosDAO(connection) {
    this._connection = connection;
}

// Cadastrar usuário
UsuariosDAO.prototype.salvar = function (usuario, callback) {
    this._connection.query(
        'INSERT INTO usuario SET ?',
        usuario,
        callback
    );
};

// Buscar por email
UsuariosDAO.prototype.buscarPorEmail = function (email, callback) {
    this._connection.query(
        'SELECT * FROM usuario WHERE usuario_email = ?',
        [email],
        callback
    ); 
};

// Atualizar último login
UsuariosDAO.prototype.atualizarUltimoLogin = function (id, callback) {
    this._connection.query(
        'UPDATE usuario SET usuario_ultimo_login = NOW() WHERE usuario_id = ?',
        [id],
        callback
    );
};

// Atualizar senha por ID
UsuariosDAO.prototype.atualizarSenha = function (id, novaSenhaHash, callback) {
    this._connection.query(
        'UPDATE usuario SET usuario_senha = ? WHERE usuario_id = ?',
        [novaSenhaHash, id],
        callback
    );
};

// Salvar dados do questionário dependendo do tipo de usuário
UsuariosDAO.prototype.salvarQuestionario = function (tipo, userId, dados, callback) {
    let tabela;

    switch (tipo) {
        case "paciente":
            tabela = "paciente";
            break;
        case "acompanhante":
            tabela = "acompanhante";
            break;
        case "voluntario":
            tabela = "voluntario";
            break;
        case "doador":
            tabela = "doador";
            break;
        default:
            return callback(new Error("Tipo inválido"));
    }

    dados.usuario_id = userId;
    this._connection.query(`INSERT INTO ${tabela} SET ?`, dados, callback);
};

module.exports = UsuariosDAO;

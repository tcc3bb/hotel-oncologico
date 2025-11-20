class DoacaoDAO {
    constructor(connection) {
        this._connection = connection;
    }

    listarPorDoador(doadorId, callback) {
        const sql = `
            SELECT * FROM doacao
            WHERE doador_id = ?
            ORDER BY doacao_data DESC
        `;
        this._connection.query(sql, [doadorId], callback);
    }

    salvar(doacao, callback) {
        const sql = "INSERT INTO doacao SET ?";
        this._connection.query(sql, doacao, callback);
    }

    buscarPorId(doacaoId, callback) {
        const sql = "SELECT * FROM doacao WHERE doacao_id = ?";
        this._connection.query(sql, [doacaoId], callback);
    }

    atualizarStatus(doacaoId, novoStatus, callback) {
        const sql = "UPDATE doacao SET doacao_status = ? WHERE doacao_id = ?";
        this._connection.query(sql, [novoStatus, doacaoId], callback);
    }
}

module.exports = DoacaoDAO;

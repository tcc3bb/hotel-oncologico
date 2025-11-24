class AvaliacaoPacienteDAO {
    constructor(connection) {
        this._connection = connection;
    }

    listarPorPaciente(pacienteId, callback) {
        console.log("📌 Executando SELECT listarPorPaciente:", pacienteId);

        const sql = `
            SELECT *
            FROM avaliacao_paciente
            WHERE paciente_id = ?
            ORDER BY data_avaliacao DESC
        `;

        this._connection.query(sql, [pacienteId], callback);
    }

    salvar(dados, callback) {
        console.log("📌 Executando INSERT salvar:", dados);

        this._connection.query("INSERT INTO avaliacao_paciente SET ?", dados, callback);
    }
}

module.exports = AvaliacaoPacienteDAO;

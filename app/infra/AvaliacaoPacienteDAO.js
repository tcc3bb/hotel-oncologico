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

    listarTodas(callback) {
    console.log("📌 Executando SELECT listarTodas");

    const sql = `
        SELECT a.*, p.paciente_nome AS paciente_nome
        FROM avaliacao_paciente a
        JOIN paciente p ON p.paciente_id = a.paciente_id
        ORDER BY a.data_avaliacao DESC
    `;

    this._connection.query(sql, callback);
}


    salvar(dados, callback) {
        console.log("📌 Executando INSERT salvar:", dados);

        this._connection.query("INSERT INTO avaliacao_paciente SET ?", dados, callback);
    }
}

module.exports = AvaliacaoPacienteDAO;

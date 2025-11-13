class PacienteDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
    SELECT  
        u.usuario_id,
        u.usuario_email,
        u.usuario_senha,
        u.usuario_tipo,
        pac.paciente_id,
        pac.paciente_email,
        pac.paciente_nome,
        pac.paciente_cpf,
        pac.paciente_rg,
        pac.paciente_nacionalidade,
        pac.paciente_data_nascimento,
        pac.paciente_sexo,
        pac.paciente_estado_civil,
        pac.paciente_altura,
        pac.paciente_peso,
        pac.paciente_tipo_sanguineo,
        pac.paciente_profissao,
        pac.paciente_telefone,
        pac.paciente_logradouro,
        pac.paciente_numero,
        pac.paciente_bairro,
        pac.paciente_cidade,
        pac.paciente_estado,
        pac.paciente_cep
    FROM usuario u
    LEFT JOIN paciente pac ON pac.usuario_id = u.usuario_id
    WHERE u.usuario_id = ?
`;


        this._connection.query(sql, [usuarioId], (err, results) => {
            if (err) return callback(err);
            if (!results.length) return callback(null, []);

            const paciente = results[0];

            // Formatar data (para exibição correta no input date)
            if (paciente.paciente_data_nascimento instanceof Date) {
                paciente.paciente_data_nascimento = paciente.paciente_data_nascimento.toISOString().split('T')[0];
            }

            callback(null, [paciente]);
        });
    }



    // 🔹 Atualizar informações do paciente e do usuário
    atualizarDados(usuarioId, dados, callback) {
        const camposPaciente = [
            'paciente_nome', 'paciente_cpf', 'paciente_rg', 'paciente_telefone',
            'paciente_logradouro', 'paciente_numero', 'paciente_bairro',
            'paciente_cidade', 'paciente_estado', 'paciente_data_nascimento'
        ];

        const updates = [];
        const valores = [];

        camposPaciente.forEach(campo => {
            if (dados[campo] !== undefined) {
                updates.push(`${campo} = ?`);
                valores.push(dados[campo]);
            }
        });

        if (!updates.length) return callback(null);

        const sql = `UPDATE paciente SET ${updates.join(', ')} WHERE usuario_id = ?`;
        valores.push(usuarioId);

        this._connection.query(sql, valores, callback);
    }

    // 🔹 Excluir conta (paciente + usuário)
    excluirConta(usuarioId, callback) {
        const sql1 = `DELETE FROM paciente WHERE usuario_id = ?`;
        const sql2 = `DELETE FROM usuario WHERE usuario_id = ?`;

        this._connection.beginTransaction(err => {
            if (err) return callback(err);

            this._connection.query(sql1, [usuarioId], err => {
                if (err) {
                    return this._connection.rollback(() => callback(err));
                }

                this._connection.query(sql2, [usuarioId], err => {
                    if (err) {
                        return this._connection.rollback(() => callback(err));
                    }

                    this._connection.commit(callback);
                });
            });
        });
    }

}

module.exports = PacienteDAO;

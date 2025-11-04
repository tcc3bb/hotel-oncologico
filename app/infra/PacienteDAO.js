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
            p.paciente_id,
            p.paciente_email,
            p.paciente_nome,
            p.paciente_cpf,
            p.paciente_rg,
            p.paciente_nacionalidade,
            p.paciente_data_nascimento,
            p.paciente_sexo,
            p.paciente_estado_civil,
            p.paciente_altura,
            p.paciente_peso,
            p.paciente_tipo_sanguineo,
            p.paciente_profissao,
            p.paciente_telefone,
            p.paciente_logradouro,
            p.paciente_numero,
            p.paciente_bairro,
            p.paciente_cidade,
            p.paciente_estado,
            p.paciente_cep
        FROM paciente p
        INNER JOIN usuario u ON p.usuario_id = u.usuario_id
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

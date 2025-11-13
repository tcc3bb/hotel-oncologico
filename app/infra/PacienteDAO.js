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
                u.usuario_data_criacao,
                u.usuario_estado,
                u.usuario_ultimo_login,
                u.usuario_foto_perfil,
                pac.paciente_id,
                pac.usuario_id AS paciente_usuario_id,
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
                pac.paciente_cep,
                pac.paciente_contato_emergencia_1_nome,
                pac.paciente_contato_emergencia_1_parentesco,
                pac.paciente_contato_emergencia_1_telefone,
                pac.paciente_contato_emergencia_2_nome,
                pac.paciente_contato_emergencia_2_parentesco,
                pac.paciente_contato_emergencia_2_telefone,
                pac.paciente_responsavel_legal_nome,
                pac.paciente_responsavel_legal_parentesco,
                pac.paciente_responsavel_legal_telefone,
                pac.paciente_centro_tratamento_nome,
                pac.paciente_medico_assistente_nome,
                pac.paciente_diagnostico,
                pac.paciente_fase_tratamento,
                pac.paciente_tipo_tratamento,
                pac.paciente_tempo_tratamento,
                pac.paciente_data_ultima_sessao,
                pac.paciente_historico_medico_resumido,
                pac.paciente_alergias_risco,
                pac.paciente_medicamentos_uso_essenciais,
                pac.paciente_vulnerabilidade_imunossupressao,
                pac.paciente_restricoes_alimentares,
                pac.paciente_restricoes_mobilidade,
                pac.paciente_preferencia_horario_refeicao,
                pac.paciente_observacoes_enfermagem,
                pac.paciente_observacoes_gerais
            FROM usuario u
            LEFT JOIN paciente pac ON pac.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
        `;

        this._connection.query(sql, [usuarioId], (err, results) => {
            if (err) return callback(err);
            if (!results.length) return callback(null, []);

            const paciente = results[0];

            // 🔹 Formatar data de nascimento corretamente (para input date)
            if (paciente.paciente_data_nascimento instanceof Date) {
                paciente.paciente_data_nascimento = paciente.paciente_data_nascimento.toISOString().split('T')[0];
            }

            callback(null, [paciente]);
        });
    }

    atualizarDados(usuarioId, dados, callback) {
        // CAMPOS DA TABELA PACIENTE
        const camposPaciente = [
            "paciente_email",
            "paciente_nome",
            "paciente_cpf",
            "paciente_rg",
            "paciente_data_nascimento",
            "paciente_sexo",
            "paciente_estado_civil",
            "paciente_profissao",
            "paciente_nacionalidade",
            "paciente_tipo_sanguineo",
            "paciente_altura",
            "paciente_peso",
            "paciente_telefone",
            "paciente_logradouro",
            "paciente_numero",
            "paciente_bairro",
            "paciente_cidade",
            "paciente_estado",
            "paciente_cep",
            "paciente_contato_emergencia_1_nome",
            "paciente_contato_emergencia_1_parentesco",
            "paciente_contato_emergencia_1_telefone",
            "paciente_contato_emergencia_2_nome",
            "paciente_contato_emergencia_2_parentesco",
            "paciente_contato_emergencia_2_telefone",
            "paciente_responsavel_legal_nome",
            "paciente_responsavel_legal_parentesco",
            "paciente_responsavel_legal_telefone",
            "paciente_centro_tratamento_nome",
            "paciente_medico_assistente_nome",
            "paciente_diagnostico",
            "paciente_fase_tratamento",
            "paciente_tipo_tratamento",
            "paciente_tempo_tratamento",
            "paciente_data_ultima_sessao",
            "paciente_historico_medico_resumido",
            "paciente_alergias_risco",
            "paciente_medicamentos_uso_essenciais",
            "paciente_vulnerabilidade_imunossupressao",
            "paciente_restricoes_alimentares",
            "paciente_restricoes_mobilidade",
            "paciente_preferencia_horario_refeicao",
            "paciente_observacoes_enfermagem",
            "paciente_observacoes_gerais"
        ];

        const updatesPaciente = [];
        const valoresPaciente = [];

        camposPaciente.forEach(campo => {
            if (dados[campo] !== undefined) {
                updatesPaciente.push(`${campo} = ?`);
                valoresPaciente.push(dados[campo]);
            }
        });

        // CAMPOS DA TABELA USUARIO
        const camposUsuario = ["usuario_email", "usuario_senha"];

        const updatesUsuario = [];
        const valoresUsuario = [];

        camposUsuario.forEach(campo => {
            if (dados[campo] !== undefined && dados[campo] !== "") {
                updatesUsuario.push(`${campo} = ?`);
                valoresUsuario.push(dados[campo]);
            }
        });

        // -----------------------------
        // 🚀 EXECUTAR AS DUAS ATUALIZAÇÕES EM TRANSAÇÃO
        // -----------------------------
        this._connection.beginTransaction(err => {
            if (err) return callback(err);

            // Atualizar tabela PACIENTE
            const sqlPaciente = `
                UPDATE paciente 
                SET ${updatesPaciente.join(", ")} 
                WHERE usuario_id = ?
            `;
            valoresPaciente.push(usuarioId);

            this._connection.query(sqlPaciente, valoresPaciente, err => {
                if (err) {
                    return this._connection.rollback(() => callback(err));
                }

                // Atualizar tabela USUARIO
                if (updatesUsuario.length > 0) {
                    const sqlUsuario = `
                        UPDATE usuario 
                        SET ${updatesUsuario.join(", ")} 
                        WHERE usuario_id = ?
                    `;
                    valoresUsuario.push(usuarioId);

                    this._connection.query(sqlUsuario, valoresUsuario, err => {
                        if (err) {
                            return this._connection.rollback(() => callback(err));
                        }

                        this._connection.commit(callback);
                    });

                } else {
                    this._connection.commit(callback);
                }
            });
        });
    }

    excluirConta(usuarioId, callback) {
        const sql1 = `DELETE FROM paciente WHERE usuario_id = ?`;
        const sql2 = `DELETE FROM usuario WHERE usuario_id = ?`;

        this._connection.beginTransaction(err => {
            if (err) return callback(err);

            this._connection.query(sql1, [usuarioId], err => {
                if (err) return this._connection.rollback(() => callback(err));

                this._connection.query(sql2, [usuarioId], err => {
                    if (err) return this._connection.rollback(() => callback(err));

                    this._connection.commit(callback);
                });
            });
        });
    }
}

module.exports = PacienteDAO;
// routes/questionarios.js
const express = require('express');

module.exports = (connectionFactory) => {
    const router = express.Router();
    const connection = connectionFactory(); // cria conexão/pool

    // --- Paciente ---
    router.get('/paciente/:id', (req, res) => {
        const { id } = req.params;
        res.render('questionarios/paciente', { usuarioId: id, erro: null });
    });

    router.post('/paciente/:id', (req, res) => {
        const { id } = req.params;
        const body = req.body;

        console.log('POST /questionarios/paciente/:id -> body:', body);

        // Passo 1: Consulta para pegar o e-mail do usuário logado
        connection.query('SELECT usuario_email FROM usuario WHERE usuario_id = ?', [id], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar e-mail do usuário:', err);
                return res.status(500).render('questionarios/paciente', {
                    erro: 'Erro ao buscar e-mail do usuário. Verifique os logs.',
                    usuarioId: id
                });
            }

            const email = rows[0].usuario_email; // Pegando o e-mail do usuário

            // Passo 2: Agora, realiza o INSERT com o e-mail
            const sql = `
                INSERT INTO paciente (
                usuario_id,
                paciente_email,
                paciente_nome,
                paciente_cpf,
                paciente_rg,
                paciente_data_nascimento,
                paciente_sexo,
                paciente_estado_civil,
                paciente_profissao,
                paciente_nacionalidade,
                paciente_tipo_sanguineo,
                paciente_altura,
                paciente_peso,
                paciente_telefone,
                paciente_logradouro,
                paciente_numero,
                paciente_complemento,
                paciente_bairro,
                paciente_estado,
                paciente_cidade,
                paciente_cep,

                paciente_contato_emergencia_1_nome,
                paciente_contato_emergencia_1_parentesco,
                paciente_contato_emergencia_1_telefone,
                paciente_contato_emergencia_2_nome,
                paciente_contato_emergencia_2_parentesco,
                paciente_contato_emergencia_2_telefone,
                paciente_responsavel_legal_nome,
                paciente_responsavel_legal_parentesco,
                paciente_responsavel_legal_telefone,

                paciente_centro_tratamento_nome,
                paciente_medico_assistente_nome,
                paciente_diagnostico,
                paciente_fase_tratamento,
                paciente_tipo_tratamento,
                paciente_tempo_tratamento,
                paciente_data_ultima_sessao,
                paciente_historico_medico_resumido,

                paciente_alergias_risco,
                paciente_medicamentos_uso_essenciais,
                paciente_vulnerabilidade_imunossupressao,
                paciente_preferencia_horario_refeicao,
                paciente_restricoes_mobilidade,
                paciente_restricoes_alimentares,
                paciente_observacoes_enfermagem,
                paciente_observacoes_gerais
            ) VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )
        `;

            const values = [
                id,
                email,
                body.paciente_nome,
                body.paciente_cpf,
                body.paciente_rg,
                body.paciente_data_nascimento,
                body.paciente_sexo,
                body.paciente_estado_civil,
                body.paciente_profissao,
                body.paciente_nacionalidade,
                body.paciente_tipo_sanguineo,
                body.paciente_altura,
                body.paciente_peso,
                body.paciente_telefone,
                body.paciente_logradouro,
                body.paciente_numero,
                body.paciente_complemento,
                body.paciente_bairro,
                body.paciente_estado,
                body.paciente_cidade,
                body.paciente_cep,

                body.paciente_contato_emergencia_1_nome,
                body.paciente_contato_emergencia_1_parentesco,
                body.paciente_contato_emergencia_1_telefone,
                body.paciente_contato_emergencia_2_nome,
                body.paciente_contato_emergencia_2_parentesco,
                body.paciente_contato_emergencia_2_telefone,
                body.paciente_responsavel_legal_nome,
                body.paciente_responsavel_legal_parentesco,
                body.paciente_responsavel_legal_telefone,

                body.paciente_centro_tratamento_nome,
                body.paciente_medico_assistente_nome,
                body.paciente_diagnostico,
                body.paciente_fase_tratamento,
                body.paciente_tipo_tratamento,
                body.paciente_tempo_tratamento,
                body.paciente_data_ultima_sessao,
                body.paciente_historico_medico_resumido,

                body.paciente_alergias_risco,
                body.paciente_medicamentos_uso_essenciais,
                body.paciente_vulnerabilidade_imunossupressao,
                body.paciente_preferencia_horario_refeicao,
                body.paciente_restricoes_mobilidade,
                body.paciente_restricoes_alimentares,
                body.paciente_observacoes_enfermagem,
                body.paciente_observacoes_gerais
            ];

            // Passo 3: Executando o INSERT
            connection.query(sql, values, (err) => {
                if (err) {
                    console.error('Erro ao salvar paciente:', err.sqlMessage || err);
                    return res.status(500).render('questionarios/paciente', {
                        erro: 'Erro ao salvar dados. Verifique o console do servidor.',
                        usuarioId: id
                    });
                }
                res.redirect('/usuarios/login');
            });
        });
    });

    // --- Acompanhante ---
    router.get('/acompanhante/:id', (req, res) => {
        const { id } = req.params;
        res.render('questionarios/acompanhante', { usuarioId: id, erro: null });
    });

    router.post('/acompanhante/:id', (req, res) => {
        const { id } = req.params;
        const { acompanhante_nome, acompanhante_email, acompanhante_cpf, acompanhante_rg, acompanhante_data_nascimento, acompanhante_sexo, acompanhante_parentesco, acompanhante_telefone, acompanhante_endereco, acompanhante_numero, acompanhante_complemento, acompanhante_cidade, acompanhante_estado, acompanhante_observacoes, paciente_email } = req.body;

        console.log('POST /acompanhante ->', req.body);

        // Passo 1: Consulta para pegar o e-mail do usuário logado
        connection.query('SELECT usuario_email FROM usuario WHERE usuario_id = ?', [id], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar e-mail do usuário:', err);
                return res.status(500).render('questionarios/acompanhante', {
                    erro: 'Erro ao buscar e-mail do usuário. Verifique os logs.',
                    usuarioId: id
                });
            }

            const email = rows[0].usuario_email; // Pegando o e-mail do usuário

            const sqlInsert = `
        INSERT INTO acompanhante (
            usuario_id,  
            acompanhante_nome, 
            acompanhante_email, 
            acompanhante_cpf, 
            acompanhante_rg,
            acompanhante_data_nascimento, 
            acompanhante_sexo, 
            acompanhante_parentesco, 
            acompanhante_telefone, 
            acompanhante_endereco, 
            acompanhante_numero, 
            acompanhante_complemento, 
            acompanhante_cidade, 
            acompanhante_estado, 
            acompanhante_observacoes, 
            paciente_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `; 

            connection.query(sqlInsert, [
                id,
                acompanhante_nome,
                email,
                acompanhante_cpf,
                acompanhante_rg,
                acompanhante_data_nascimento,
                acompanhante_sexo,
                acompanhante_parentesco,
                acompanhante_telefone,
                acompanhante_endereco,
                acompanhante_numero,
                acompanhante_complemento,
                acompanhante_cidade,
                acompanhante_estado,
                acompanhante_observacoes,
                paciente_email,
            ], (err) => {
                if (err) {
                    console.error('Erro ao inserir acompanhante:', err);
                    return res.status(500).render('questionarios/acompanhante', {
                        erro: 'Erro ao salvar dados. Verifique os dados informados.',
                        usuarioId: id
                    });
                }

                res.redirect('/usuarios/login');
            });
        });
    });



    // --- Voluntário ---
    router.get('/voluntario/:id', (req, res) => {
        const { id } = req.params;
        res.render('questionarios/voluntario', { usuarioId: id, erro: null });
    });

    router.post('/voluntario/:id', (req, res) => {
        const { id } = req.params;

        const {
            voluntario_nome,
            voluntario_cpf,
            voluntario_rg,
            voluntario_data_nascimento,
            voluntario_sexo,
            voluntario_estado_civil,
            voluntario_telefone,
            voluntario_endereco,
            voluntario_cidade,
            voluntario_estado,
            voluntario_area_atuacao,
            voluntario_habilidades,
            voluntario_disponibilidade,
            voluntario_horarios_disponiveis,
            voluntario_experiencia_previa,
            voluntario_certificado,
            voluntario_observacoes
        } = req.body;

        console.log('POST /voluntario ->', req.body);

        const sql = `
        INSERT INTO voluntario (
            usuario_id,
            voluntario_nome,
            voluntario_cpf,
            voluntario_rg,
            voluntario_data_nascimento,
            voluntario_sexo,
            voluntario_estado_civil,
            voluntario_telefone,
            voluntario_endereco,
            voluntario_cidade,
            voluntario_estado,
            voluntario_area_atuacao,
            voluntario_habilidades,
            voluntario_disponibilidade,
            voluntario_horarios_disponiveis,
            voluntario_experiencia_previa,
            voluntario_certificado,
            voluntario_observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        connection.query(sql, [
            id,
            voluntario_nome,
            voluntario_cpf,
            voluntario_rg,
            voluntario_data_nascimento,
            voluntario_sexo,
            voluntario_estado_civil,
            voluntario_telefone,
            voluntario_endereco,
            voluntario_cidade,
            voluntario_estado,
            voluntario_area_atuacao,
            voluntario_habilidades,
            voluntario_disponibilidade,
            voluntario_horarios_disponiveis,
            voluntario_experiencia_previa,
            voluntario_certificado ? 1 : 0,
            voluntario_observacoes
        ], (err) => {
            if (err) {
                console.error('Erro ao salvar voluntário:', err);
                return res.status(500).render('questionarios/voluntario', { erro: 'Erro ao salvar dados.', usuarioId: id });
            }
            res.redirect('/usuarios/login');
        });
    });


    // --- Doador ---
    router.get('/doador/:id', (req, res) => {
        const { id } = req.params;
        res.render('questionarios/doador', { usuarioId: id, erro: null });
    });

    router.post('/doador/:id', (req, res) => {
    const { id } = req.params;

    const tipoPessoa = req.body.tipo_pessoa; // fisica ou juridica

    console.log("Recebido:", req.body);

    // Objeto base
    let dados = {
        usuario_id: id,
        doador_tipo: tipoPessoa === "fisica" ? "Pessoa Física" : "Pessoa Jurídica",
        doador_logradouro: req.body.doador_endereco || null,
        doador_numero: req.body.doador_numero || null,
        doador_complemento: req.body.doador_complemento || null,
        doador_bairro: req.body.doador_bairro || null,
        doador_cidade: req.body.doador_cidade || null,
        doador_estado: req.body.doador_estado || null,
        doador_cep: req.body.doador_cep || null
    };

    if (tipoPessoa === "fisica") {

        dados = {
            ...dados,
            doador_nome: req.body.doador_nome,
            doador_cpf: req.body.doador_cpf,
            doador_rg: req.body.doador_rg || null,
            doador_data_nascimento: req.body.doador_data_nascimento || null,
            doador_sexo: req.body.doador_sexo || null,
            doador_telefone: req.body.doador_telefone || null,

            // Campos PJ precisam estar NULL para não quebrar UNIQUE
            doador_nome_empresa: null,
            doador_area_atuacao_empresa: null,
            doador_cnpj: null,
            doador_telefone_empresa: null,
            doador_representante: null,
            doador_cpf_representante: null
        };

    } else if (tipoPessoa === "juridica") {

        dados = {
            ...dados,
            doador_nome_empresa: req.body.doador_nome_empresa,
            doador_area_atuacao_empresa: req.body.doador_area_atuacao_empresa || null,
            doador_cnpj: req.body.doador_cnpj,
            doador_telefone_empresa: req.body.doador_telefone_empresa || null,
            doador_representante: req.body.doador_representante || null,
            doador_cpf_representante: req.body.doador_cpf_representante || null,

            // Campos PF precisam estar NULL
            doador_nome: null,
            doador_cpf: null,
            doador_rg: null,
            doador_data_nascimento: null,
            doador_sexo: null,
            doador_telefone: null
        };
    }

    const sql = `INSERT INTO doador SET ?`;

    connection.query(sql, dados, (err) => {
        if (err) {
            console.error("Erro ao salvar doador:", err);
            return res.status(500).render("questionarios/doador", {
                usuarioId: id,
                erro: "Erro ao salvar dados. Verifique as informações."
            });
        }

        res.redirect('/usuarios/login');
    });
});




    // --- Admin ---
    router.get('/admin/:id', (req, res) => {
        const { id } = req.params;
        res.render('questionarios/admin', { usuarioId: id, erro: null });
    });

    router.post('/admin/:id', (req, res) => {
        const { id } = req.params;

        const {
            admin_nome,
            admin_cpf,
            admin_rg,
            admin_data_nascimento,
            admin_sexo,
            admin_estado_civil,
            admin_telefone,
            admin_celular,
            admin_email_alternativo,
            admin_endereco,
            admin_numero,
            admin_bairro,
            admin_cidade,
            admin_estado,
            admin_cep,
            admin_cargo,
            admin_nivel_acesso,
            admin_data_inicio,
            admin_data_saida,
            admin_observacoes,
            admin_observacoes_internas
        } = req.body;

        console.log('POST /admin ->', req.body);

        const sql = `
        INSERT INTO admin (
            usuario_id,
            admin_nome,
            admin_cpf,
            admin_rg,
            admin_data_nascimento,
            admin_sexo,
            admin_estado_civil,
            admin_telefone,
            admin_celular,
            admin_email_alternativo,
            admin_endereco,
            admin_numero,
            admin_bairro,
            admin_cidade,
            admin_estado,
            admin_cep,
            admin_cargo,
            admin_nivel_acesso,
            admin_data_inicio,
            admin_data_saida,
            admin_observacoes,
            admin_observacoes_internas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            id,
            admin_nome,
            admin_cpf,
            admin_rg,
            admin_data_nascimento,
            admin_sexo,
            admin_estado_civil,
            admin_telefone,
            admin_celular,
            admin_email_alternativo,
            admin_endereco,
            admin_numero,
            admin_bairro,
            admin_cidade,
            admin_estado,
            admin_cep,
            admin_cargo,
            admin_nivel_acesso,
            admin_data_inicio,
            admin_data_saida,
            admin_observacoes,
            admin_observacoes_internas
        ];

        connection.query(sql, values, (err) => {
            if (err) {
                console.error('Erro ao inserir admin:', err);
                return res.status(500).render('questionarios/admin', {
                    erro: 'Erro ao salvar dados. Verifique as informações e tente novamente.',
                    usuarioId: id
                });
            }

            res.redirect('/usuarios/login');
        });
    });



    return router;
};

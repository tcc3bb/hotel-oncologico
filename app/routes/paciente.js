module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const PacienteDAO = require('../infra/PacienteDAO');
    const verificaLogin = require('../middlewares/verificaLogin');
    const ReservasDAO = require('../infra/ReservasDAO');

    router.get('/minhas-reservas', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');

        const usuarioId = req.session.user.id;
        const connection = connectionFactory();

        const pacienteDAO = new PacienteDAO(connection);
        const reservasDAO = new ReservasDAO(connection);

        // ------------------------------------
        // 1) BUSCA OS DADOS COMPLETOS DO PACIENTE
        // ------------------------------------
        pacienteDAO.buscarDadosCompletos(usuarioId, (err, resultados) => {
            if (err) {
                console.error('Erro MySQL em buscarDadosCompletos:', err);
                connection.end();
                return res.status(500).send('Erro ao buscar informações.');
            }

            let paciente = resultados[0] || null;

            // ------------------------------------
            // 2) GARANTE QUE É PACIENTE
            // (mantendo a mesma regra do segundo GET)
            // ------------------------------------
            if (req.session.user.tipo !== 'paciente') {
                connection.end();
                return res.status(403).send("Acesso negado. Apenas pacientes.");
            }

            // ------------------------------------
            // 3) BUSCA paciente_id PELO usuario_id
            // (função original do segundo GET)
            // ------------------------------------
            reservasDAO.buscarPacienteIdPorUsuarioId(usuarioId, (erro, pacienteId) => {
                if (erro || !pacienteId) {
                    connection.end();
                    return res.render('paciente/minhas-reservas', {
                        user: req.session.user,
                        paciente: paciente || {},
                        reservas: [],
                        usuario: paciente
                            ? {
                                usuario_id: paciente.usuario_id,
                                usuario_email: paciente.usuario_email,
                                usuario_senha: paciente.usuario_senha
                            }
                            : req.session.user
                    });
                }

                // ------------------------------------
                // 4) LISTA AS RESERVAS DO PACIENTE
                // ------------------------------------
                reservasDAO.listarPorPaciente(pacienteId, (erro2, reservas) => {
                    connection.end();

                    if (erro2) {
                        return res.status(500).send("Erro ao carregar suas reservas.");
                    }

                    // ------------------------------------
                    // 5) RENDER FINAL COM TUDO JUNTO
                    // ------------------------------------
                    return res.render('paciente/minhas-reservas', {
                        user: req.session.user,
                        paciente: paciente || {},
                        reservas: reservas || [],
                        usuario: paciente
                            ? {
                                usuario_id: paciente.usuario_id,
                                usuario_email: paciente.usuario_email,
                                usuario_senha: paciente.usuario_senha
                            }
                            : req.session.user
                    });
                });
            });
        });
    });





    // 🔹 POST /paciente/verificar-senha
    router.post('/verificar-senha', (req, res) => {
        if (!req.session?.user) return res.status(401).send('Não autorizado.');

        const { senha } = req.body;
        const senhaHash = req.session.user.senha; // ou busque do banco
        bcrypt.compare(senha, senhaHash, (err, ok) => {
            if (ok) return res.json({ autorizado: true });
            res.json({ autorizado: false });
        });
    });

    // 🔹 POST /paciente/atualizar
    router.post('/atualizar', (req, res) => {
        if (!req.session?.user) return res.status(401).json({ ok: false, mensagem: 'Não autorizado.' });
        const usuarioId = req.session.user.id;
        const dados = req.body;
        const connection = connectionFactory();
        const pacienteDAO = new PacienteDAO(connection);
        pacienteDAO.atualizarDados(usuarioId, dados, (err) => {
            if (err) {
                console.error('Erro MySQL em atualizarDados:', err);
                return res.status(500).json({ ok: false, mensagem: 'Erro ao atualizar informações.' });
            }
            res.json({ ok: true, mensagem: 'Informações atualizadas com sucesso!' });
        });
    });


    // 🔹 DELETE /paciente/excluir
    router.delete('/excluir', (req, res) => {
        if (!req.session?.user) return res.status(401).json({ ok: false, mensagem: 'Não autorizado.' });

        const usuarioId = req.session.user.id;
        const connection = connectionFactory();
        const pacienteDAO = new PacienteDAO(connection);

        pacienteDAO.excluirConta(usuarioId, (err) => {
            if (err) {
                console.error('Erro MySQL ao excluir conta:', err);
                return res.status(500).json({ ok: false, mensagem: 'Erro ao excluir conta.' });
            }

            req.session.destroy(() => {
                res.json({ ok: true, mensagem: 'Conta excluída com sucesso!' });
            });
        });
    });



    // =======================
    // DETALHES (RETORNA JSON PARA O MODAL)
    // =======================
    router.get('/reservas/detalhes/:id', verificaLogin, (req, res) => {
        const connection = connectionFactory();
        const dao = new ReservasDAO(connection);
        dao.buscarDetalhes(req.params.id, (erro, resultado) => {
            connection.end();
            res.json(resultado[0]);
        });
    });




    return router;
};
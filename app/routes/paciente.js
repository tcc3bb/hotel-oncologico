module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const PacienteDAO = require('../infra/PacienteDAO');

    // 🔹 GET /paciente/minhas-reservas
    router.get('/minhas-reservas', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');

        const usuarioId = req.session.user.id;
        const connection = connectionFactory();
        const pacienteDAO = new PacienteDAO(connection);

        pacienteDAO.buscarDadosCompletos(usuarioId, (err, resultados) => {
            if (err) {
                console.error('Erro MySQL em buscarDadosCompletos:', err);
                return res.status(500).send('Erro ao buscar informações.');
            }

            // Nenhum paciente encontrado
            if (!resultados.length) { 
                return res.render('paciente/minhas-reservas', {
                    user: req.session.user,
                    paciente: {},
                    reservas: [],
                    usuario: req.session.user
                });
            }


            const paciente = resultados[0]; 
            const reservas = []; 

            return res.render('paciente/minhas-reservas', {
                user: req.session.user,
                paciente,
                usuario: {
                    usuario_email: paciente.usuario_email,
                    usuario_senha: paciente.usuario_senha
                },
                reservas,
                usuario: req.session.user
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



    return router;
};
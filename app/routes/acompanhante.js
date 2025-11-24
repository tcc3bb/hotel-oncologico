module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();
    const AcompanhanteDAO = require('../infra/AcompanhanteDAO');
    const PacienteDAO = require('../infra/PacienteDAO');

    // ==========================================
    // 🔹 Página Minha Conta — Acompanhante
    // ==========================================
    router.get('/apoio-ao-paciente', (req, res) => {
        if (!req.session?.user)
            return res.redirect('/usuarios/login');

        const usuarioId = req.session.user.id;

        const connection = connectionFactory();
        const acompDAO = new AcompanhanteDAO(connection);
        const pacDAO = new PacienteDAO(connection);

        // 1️⃣ Buscar acompanhante pelo usuario_id
        acompDAO.buscarPorUsuarioId(usuarioId, (err, acompResults) => {
            if (err) {
                console.error("Erro ao buscar acompanhante:", err);
                connection.end();
                return res.send("Erro ao carregar dados.");
            }

            if (!acompResults || acompResults.length === 0) {
                connection.end();
                return res.send("Nenhum acompanhante encontrado.");
            }

            const acompanhante = acompResults[0];
            const pacienteEmail = acompanhante.paciente_email;

            // 2️⃣ Buscar paciente vinculado pelo email
            pacDAO.buscarPorEmail(pacienteEmail, (err, pacResults) => {
                connection.end();

                if (err) {
                    console.error("Erro ao buscar paciente:", err);
                    return res.send("Erro ao carregar dados do paciente.");
                }

                if (!pacResults || pacResults.length === 0) {
                    return res.send("Paciente vinculado não encontrado.");
                }

                // ✅ CORREÇÃO: Passar 'dados' (acompanhante) e 'paciente' para o template
                res.render('acompanhante/apoio-ao-paciente', {
                    dados: acompanhante,  // Adicione isso: 'dados' agora contém os dados do acompanhante
                    paciente: pacResults[0]
                });
            });
        });
    });


    // ==========================================
    // 🔹 Atualizar dados do acompanhante
    // ==========================================
    router.post('/atualizar', (req, res) => {

        if (!req.session?.user) {
            return res.status(401).json({ ok: false, mensagem: 'Não autorizado.' });
        }

        const usuarioId = req.session.user.id; // chave mestra
        const dados = req.body;

        const connection = connectionFactory();
        const dao = new AcompanhanteDAO(connection);

        dao.atualizarDados(usuarioId, dados, (err) => {
            connection.end();

            if (err) {
                console.error('Erro MySQL em atualizarDados (Acompanhante):', err);
                return res.status(500).json({ ok: false, mensagem: 'Erro ao atualizar informações.' });
            }

            res.json({ ok: true, mensagem: 'Informações atualizadas com sucesso!' });
        });
    });


    // ==========================================
    // 🔹 Excluir conta COMPLETA (usuario + acompanhante)
    // ==========================================
    router.delete('/excluir/:usuarioId', (req, res) => {
        const usuarioId = req.params.usuarioId;

        const connection = connectionFactory();
        const dao = new AcompanhanteDAO(connection);

        dao.excluirConta(usuarioId, err => {
            connection.end();

            if (err) {
                console.error("Erro ao excluir conta:", err);
                return res.json({ ok: false, message: err.message });
            }

            req.session.destroy(() => { });
            res.json({ ok: true });
        });
    });

    return router;
};

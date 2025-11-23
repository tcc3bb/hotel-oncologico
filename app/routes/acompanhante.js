module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();
    const AcompanhanteDAO = require('../infra/AcompanhanteDAO');

    // ==========================================
    // 🔹 Página Minha Conta — Acompanhante
    // ==========================================
    router.get('/apoio-ao-paciente', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');

        const usuarioId = req.session.user.id;

        const connection = connectionFactory();
        const dao = new AcompanhanteDAO(connection);

        dao.buscarDadosCompletos(usuarioId, (err, result) => {
            connection.end();

            if (err) {
                console.error("Erro na busca do acompanhante:", err);
                return res.send("Erro ao carregar dados.");
            }

            if (!result || result.length === 0) {
                console.error("Nenhum acompanhante encontrado para o usuario_id:", usuarioId);
                return res.send("Erro ao carregar dados.");
            }

            res.render('acompanhante/apoio-ao-paciente', {
                dados: result[0]
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

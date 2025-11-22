module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const verificaLogin = require('../middlewares/verificaLogin');
    const DoadorDAO = require('../infra/DoadorDAO');
    const DoacaoDAO = require('../infra/DoacaoDAO');
    const UsuarioDAO = require('../infra/UsuariosDAO');

    router.get('/minhas-doacoes', (req, res) => {
        if (!req.session.user) return res.redirect('/usuarios/login');

        const usuarioId = req.session.user.id;

        const connection = connectionFactory();
        const doadorDAO = new DoadorDAO(connection);
        const doacaoDAO = new DoacaoDAO(connection);

        doadorDAO.buscarDadosCompletos(usuarioId, (erro, doador) => {
            if (erro) return res.send("Erro interno");
            if (!doador) return res.send("Doador não encontrado");

            // Agora sim temos o doador_id
            doacaoDAO.listarPorDoador(doador.doador_id, (erro2, doacoes) => {
                if (erro2) return res.send("Erro interno ao buscar doações");

                doacaoDAO.calcularTotais(doador.doador_id, (erro3, totais) => {
                    if (erro3) return res.send("Erro ao calcular totais");

                    res.render('doador/minhas-doacoes', {
                        user: req.session.user,
                        email: doador.usuario_email,
                        doador,
                        doacoes,
                        totais
                    });

                });
            });
        });
    });



    router.post('/atualizar', (req, res) => {
        if (!req.session.user) return res.json({ ok: false, mensagem: "Não autenticado" });

        const usuarioId = req.session.user.id;
        const dados = req.body;

        const connection = connectionFactory();
        const doadorDAO = new DoadorDAO(connection);

        doadorDAO.atualizarDados(usuarioId, dados, (erro) => {
            if (erro) return res.json({ ok: false, mensagem: "Erro ao atualizar" });

            res.json({ ok: true, mensagem: "Dados atualizados com sucesso!" });
        });
    });

    router.delete('/excluir', (req, res) => {
        if (!req.session.user) return res.json({ ok: false, mensagem: "Não autenticado" });

        const usuarioId = req.session.user.id;

        const connection = connectionFactory();
        const doadorDAO = new DoadorDAO(connection);

        doadorDAO.excluir(usuarioId, (erro) => {
            if (erro) return res.json({ ok: false, mensagem: "Erro ao excluir" });

            req.session.destroy(() => {
                res.json({ ok: true, mensagem: "Conta excluída com sucesso!" });
            });
        });
    });

    return router;

};
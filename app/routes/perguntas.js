module.exports = function (PerguntasDAO, ArtigosDAO) {
    const express = require('express');
    const router = express.Router();

    router.get('/perguntas-frequentes', (req, res) => {
        const connectionFactory = require('../infra/connectionFactory');
        const connection = connectionFactory();

        const perguntasDAO = new PerguntasDAO(connection);
        const artigosDAO = ArtigosDAO(connection); // ✅ sem "new"

        perguntasDAO.listarComRespostas((erro, perguntas) => {
            if (erro) {
                console.error('Erro ao buscar perguntas:', erro);
                return res.status(500).send('Erro no servidor');
            }

            artigosDAO.listarArtigos((erro2, artigos) => {
                if (erro2) {
                    console.error('Erro ao buscar artigos:', erro2);
                    return res.status(500).send('Erro no servidor');
                }

                res.render('nav/perguntas-frequentes', {
                    user: req.session.user,
                    perguntas,
                    artigos
                });
            });
        });
    });





    // Rota para salvar nova pergunta
    router.post('/nova', (req, res) => {
        const connectionFactory = require('../infra/connectionFactory');
        const connection = connectionFactory();

        const perguntasDAO = new PerguntasDAO(connection);

        const pergunta = {
            pergunta_titulo: req.body.titulo,
            pergunta_conteudo: req.body.conteudo,
            usuario_id: req.session.user ? req.session.user.id : 1,
            pergunta_status: 'publicada',       // padrão
            pergunta_curtidas: 0,
            pergunta_visualizacoes: 0,
            pergunta_aprovada_admin: 0,
            pergunta_editada: 0,
            pergunta_editada_por: null,
            pergunta_deletada: 0,
            pergunta_ip_criacao: req.ip || null,
            pergunta_observacoes: null,
            pergunta_observacoes_internas: null
        };

        perguntasDAO.inserirPergunta(pergunta, (erro) => {
            if (erro) {
                console.error('Erro ao salvar pergunta:', erro);
                return res.status(500).send('Erro no servidor');
            }
            res.redirect('/perguntas/perguntas-frequentes');
        });
    });

    // Rota para responder uma pergunta
    router.post('/:id/responder', (req, res) => {
        const connectionFactory = require('../infra/connectionFactory');
        const connection = connectionFactory();

        const perguntasDAO = new PerguntasDAO(connection);

        const resposta = {
            resposta_conteudo: req.body.conteudo,
            pergunta_id: req.params.id,
            usuario_id: req.session.user ? req.session.user.id : 1,
            resposta_status: 'publicada',        // padrão
            resposta_curtidas: 0,
            resposta_visualizacoes: 0,
            resposta_aprovada_admin: 0,
            resposta_editada: 0,
            resposta_editada_por: null,
            resposta_deletada: 0,
            resposta_ip_criacao: req.ip || null,
            resposta_observacoes: null,
            resposta_observacoes_internas: null,
            resposta_pai_id: null                  // caso seja resposta de outra resposta
        };

        perguntasDAO.inserirResposta(resposta, (erro) => {
            if (erro) {
                console.error('Erro ao salvar resposta:', erro);
                return res.status(500).send('Erro no servidor');
            }
            res.redirect('/perguntas/perguntas-frequentes');
        });
    });

    return router;
};

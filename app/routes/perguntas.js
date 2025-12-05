module.exports = function (PerguntasDAO, ArtigosDAO) {
    const express = require('express');
    const router = express.Router();

    router.get('/perguntas-frequentes', (req, res) => {
        const connectionFactory = require('../infra/connectionFactory');
        const connection = connectionFactory();

        const perguntasDAO = new PerguntasDAO(connection);
        const artigosDAO = new ArtigosDAO(connection);
        const AvaliacaoPacienteDAO = require('../infra/AvaliacaoPacienteDAO');
        const avaliacaoDAO = new AvaliacaoPacienteDAO(connection);


        // =============================
        // 1️⃣ BUSCAR PERGUNTAS
        // =============================
        perguntasDAO.listarComRespostas((erro, perguntas) => {

            if (erro) {
                console.error("❌ ERRO ao buscar perguntas:", erro);
                return res.status(500).send("Erro no servidor ao buscar perguntas.");
            }


            // =============================
            // 2️⃣ BUSCAR ARTIGOS
            // =============================

            artigosDAO.listarArtigos((erro2, artigos) => {

                if (erro2) {
                    console.error("❌ ERRO ao buscar artigos:", erro2);
                    return res.status(500).send("Erro no servidor ao buscar artigos.");
                }

                // =============================
                // 3️⃣ BUSCAR AVALIAÇÕES
                // =============================

                avaliacaoDAO.listarTodas((erro3, avaliacoes) => {

                    if (erro3) {
                        console.error("❌ ERRO ao buscar avaliações:", erro3);
                        return res.status(500).send("Erro no servidor ao buscar avaliações.");
                    }


                    // =============================
                    // 4️⃣ FINALMENTE, RENDERIZAR
                    // =============================
                    res.render('nav/perguntas-frequentes', {
                        user: req.session.user,
                        perguntas,
                        artigos,
                        avaliacoes
                    });

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

    // -------------- ROTA PARA OBTER ARTIGO COMPLETO (USADO PELO MODAL) --------------
router.get('/artigos/public/:id', (req, res) => {
    const connectionFactory = require('../infra/connectionFactory');
    const connection = connectionFactory();
    const ArtigosDAO = require('../infra/ArtigosDAO');
    const artigosDAO = new ArtigosDAO(connection);

    const id = req.params.id;

    artigosDAO.buscarPorId(id, (erro, artigo) => {
        if (erro) {
            console.error("❌ ERRO ao buscar artigo:", erro);
            return res.status(500).json({ erro: "Erro no servidor" });
        }

        if (!artigo) {
            return res.status(404).json({ erro: "Artigo não encontrado" });
        }

        // GARANTE que os campos tenham o nome esperado no front
        res.json({
            artigo_titulo: artigo.titulo,
            artigo_subtitulo: artigo.subtitulo,
            artigo_categoria: artigo.categoria,
            artigo_resumo: artigo.resumo,
            artigo_conteudo: artigo.conteudo,
            artigo_palavras_chave: artigo.palavras_chave,
            artigo_autor: artigo.autor,
            artigo_data_publicacao: artigo.data_publicacao,
            artigo_imagem_capa: artigo.imagem
        });
    });
});


    return router;
};

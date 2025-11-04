const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verificaAdmin = require('../middlewares/verificaAdmin');

const connectionFactory = require('../infra/connectionFactory');
const ArtigosDAO = require('../infra/ArtigosDAO');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../static/image/artigos'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Listar todos os artigos
router.get('/', (req, res) => {
    console.log('[ROTA] GET /admin/artigos/');
    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);
    artigosDAO.listarArtigos((err, artigos) => {
        if (err) {
            console.error('[ERRO] listarArtigos:', err);
            return res.status(500).json({ erro: 'Erro ao listar artigos' });
        }
        console.log('[INFO] Artigos listados:', artigos.length);
        res.json(artigos);
    });
});

// Renderizar página de novo artigo
router.get('/novo', verificaAdmin, (req, res) => {
    console.log('[ROTA] GET /admin/artigos/novo');
    res.render('artigos/novo', { erro: null, user: req.session.user });
});

// Obter artigo específico (para edição ou visualização)
router.get('/:id', verificaAdmin, (req, res) => {
    console.log('[ROTA] GET /admin/artigos/:id');
    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);
    const artigoId = req.params.id;
    console.log('[INFO] ID recebido:', artigoId);

    if (isNaN(parseInt(artigoId))) {
        console.warn('[WARN] ID inválido:', artigoId);
        return res.status(400).json({ erro: 'ID do artigo inválido.' });
    }

    artigosDAO.buscarPorId(artigoId, (err, resultado) => {
        if (err) {
            console.error('[ERRO] buscarPorId:', err);
            return res.status(500).json({ erro: 'Erro ao buscar artigo no servidor' });
        }

        console.log('[INFO] Resultado do DAO:', resultado);

        if (!resultado || resultado.length === 0) {
            console.warn('[WARN] Artigo não encontrado:', artigoId);
            return res.status(404).json({ erro: 'Artigo não encontrado' });
        }

        const artigoEncontrado = resultado[0];
        console.log('[INFO] Artigo encontrado:', artigoEncontrado.artigo_titulo);

        // Incrementa visualizações
        artigosDAO.incrementarVisualizacao(artigoId, (err2) => {
            if (err2) console.error('[ERRO] incrementarVisualizacao:', err2);
            else console.log('[INFO] Visualização incrementada com sucesso');
        });

        res.json(artigoEncontrado); // Retorna o artigo
    });
});

// Criar novo artigo
router.post('/', verificaAdmin, upload.single('imagem'), (req, res) => {
    console.log('[ROTA] POST /admin/artigos/');
    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    const { titulo, conteudo } = req.body;
    const imagem = req.file ? `/image/artigos/${req.file.filename}` : null;

    if (!titulo || !conteudo) {
        console.warn('[WARN] Título ou conteúdo ausentes');
        return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios' });
    }

    const artigo = { titulo, conteudo, imagem };
    console.log('[INFO] Dados do novo artigo:', artigo);

    artigosDAO.criarArtigo(artigo, (err, resultado) => {
        if (err) {
            console.error('[ERRO] criarArtigo:', err);
            return res.status(500).json({ erro: 'Erro ao adicionar artigo' });
        }
        console.log('[INFO] Artigo criado com sucesso. ID:', resultado.insertId);
        res.redirect('/admin/painel');
    });
});

// Atualizar artigo existente
router.put('/:id', verificaAdmin, upload.single('artigo_imagem_capa'), (req, res) => {
    console.log('[ROTA] PUT /admin/artigos/:id');
    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    const artigoId = req.params.id;
    console.log('[INFO] ID recebido para atualização:', artigoId);

    const dados = {
        artigo_titulo: req.body.artigo_titulo,
        artigo_subtitulo: req.body.artigo_subtitulo,
        artigo_categoria: req.body.artigo_categoria,
        artigo_resumo: req.body.artigo_resumo,
        artigo_conteudo: req.body.artigo_conteudo,
        artigo_palavras_chave: req.body.artigo_palavras_chave,
        artigo_slug: req.body.artigo_slug,
        artigo_imagem_capa: req.file
            ? `/image/artigos/${req.file.filename}`
            : req.body.artigo_imagem_capa
    };

    console.log('[INFO] Dados recebidos para atualização:', dados);

    artigosDAO.atualizarArtigo(artigoId, dados, (err, resultado) => {
        if (err) {
            console.error('[ERRO] atualizarArtigo:', err);
            return res.status(500).send('Erro ao atualizar artigo.');
        }
        console.log('[INFO] Artigo atualizado com sucesso. Linhas afetadas:', resultado.affectedRows);
        res.redirect('/admin/painel');
    });
});

// Excluir artigo
router.delete('/:id', verificaAdmin, (req, res) => {
    console.log('[ROTA] DELETE /admin/artigos/:id');
    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    const artigoId = req.params.id;
    console.log('[INFO] ID recebido para exclusão:', artigoId);

    artigosDAO.excluirArtigo(artigoId, (err, resultado) => {
        if (err) {
            console.error('[ERRO] excluirArtigo:', err);
            return res.status(500).json({ erro: 'Erro ao remover artigo' });
        }
        console.log('[INFO] Artigo removido com sucesso. Linhas afetadas:', resultado.affectedRows);
        res.json({ sucesso: true, removido: resultado.affectedRows });
    });
}); 

module.exports = router;

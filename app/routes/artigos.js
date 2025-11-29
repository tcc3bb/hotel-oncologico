/** ROTAS DE ARTIGOS - ADMIN **/

const express = require('express');
const router = express.Router();
const connectionFactory = require('../infra/connectionFactory');
const ArtigosDAO = require('../infra/ArtigosDAO');
const verificaAdmin = require('../middlewares/verificaAdmin');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ========================================
// LOG CENTRALIZADO
// ========================================
function log(...msg) {
    console.log('[ARTIGOS]', ...msg);
}

// =============================
// CONFIGURAÇÃO DO UPLOAD
// =============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/image/artigos');

        if (!fs.existsSync(dir)) {
            log('Pasta não encontrada. Criando diretório:', dir);
            fs.mkdirSync(dir, { recursive: true });
        }

        log('Destino do upload definido para:', dir);
        cb(null, dir);
    },

    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        log('Gerando nome de arquivo para upload:', fileName);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// =============================
// FUNÇÃO PARA GERAR SLUG
// =============================
function gerarSlug(texto) {
    const slug = texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, '-');

    log('Slug gerado:', slug);
    return slug;
}

// =============================
// LISTAR ARTIGOS NO PAINEL
// =============================
router.get('/', verificaAdmin, (req, res) => {
    log('Requisição GET /admin/artigos');

    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    log('Consultando artigos no banco...');

    artigosDAO.listarTodos((err, artigos) => {
        if (err) {
            log('Erro ao listar artigos:', err);
            return res.status(500).send("Erro ao carregar artigos.");
        }

        log(`Artigos carregados com sucesso. Total: ${artigos.length}`);

        res.render('admin/painel_artigos', {
            admin: req.session.admin,
            artigos
        });
    });
});

// =============================
// CRIAR NOVO ARTIGO
// =============================
router.post('/', verificaAdmin, upload.single('artigo_imagem_capa'), (req, res) => {

    log('Recebida requisição POST /admin/artigos');
    log('Body recebido:', req.body);

    if (req.file) {
        log('Imagem de capa recebida:', req.file.filename);
    } else {
        log('Nenhuma imagem de capa enviada.');
    }

    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    log('Conexão com o banco criada.');

    const {
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_descricao_meta,
        artigo_categoria,
        artigo_tags,
        artigo_status,
        artigo_destacado,
        artigo_observacoes_internas
    } = req.body;

    let artigo_slug = gerarSlug(artigo_titulo);

    const artigo = {
        admin_id: req.session.admin.admin_id,
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_descricao_meta,
        artigo_categoria,
        artigo_tags,
        artigo_status: artigo_status || "rascunho",
        artigo_destacado: artigo_destacado ? 1 : 0,
        artigo_observacoes_internas,
        artigo_slug,
        artigo_imagem_capa: req.file ? `/image/artigos/${req.file.filename}` : null,
        artigo_imagens_extras: null,
        artigo_data_publicacao: artigo_status === "publicado" ? new Date() : null
    };

    log('Objeto artigo montado:', artigo);

    artigosDAO.criarArtigo(artigo, (err, resultado) => {
        if (err) {
            log('Erro ao criar artigo no banco:', err);
            return res.status(500).send("Erro ao criar artigo.");
        }

        log('Artigo criado com sucesso. ID:', resultado.insertId);
        res.redirect('/admin/painel');
    });
});

// =============================
// EDITAR ARTIGO
// =============================
router.post('/editar/:id', verificaAdmin, upload.single('artigo_imagem_capa'), (req, res) => {

    const artigo_id = req.params.id;
    log(`Recebida requisição para editar artigo ID ${artigo_id}`);

    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    log('Body recebido:', req.body);

    if (req.file) {
        log('Nova imagem de capa enviada:', req.file.filename);
    }

    const {
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_descricao_meta,
        artigo_categoria,
        artigo_tags,
        artigo_status,
        artigo_destacado,
        artigo_observacoes_internas
    } = req.body;

    let artigo_slug = gerarSlug(artigo_titulo);

    const dadosAtualizados = {
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_descricao_meta,
        artigo_categoria,
        artigo_tags,
        artigo_status,
        artigo_destacado: artigo_destacado ? 1 : 0,
        artigo_observacoes_internas,
        artigo_slug,
        artigo_data_atualizacao: new Date()
    };

    if (req.file) {
        dadosAtualizados.artigo_imagem_capa = `/image/artigos/${req.file.filename}`;
    }

    log('Dados atualizados:', dadosAtualizados);

    artigosDAO.atualizarArtigo(artigo_id, dadosAtualizados, (err, resultado) => {
        if (err) {
            log('Erro ao atualizar artigo:', err);
            return res.status(500).send("Erro ao atualizar artigo.");
        }

        log(`Artigo ID ${artigo_id} atualizado com sucesso.`);
        res.redirect('/admin/painel');
    });
});

// =============================
// APAGAR ARTIGO
// =============================
router.get('/deletar/:id', verificaAdmin, (req, res) => {
    const artigo_id = req.params.id;

    log(`Requisição DELETE para artigo ID ${artigo_id}`);

    const connection = connectionFactory();
    const artigosDAO = ArtigosDAO(connection);

    artigosDAO.deletarArtigo(artigo_id, (err) => {
        if (err) {
            log('Erro ao deletar artigo:', err);
            return res.status(500).send("Erro ao deletar artigo.");
        }

        log(`Artigo ID ${artigo_id} deletado com sucesso.`);
        res.redirect('/admin/painel');
    });
});

module.exports = router;

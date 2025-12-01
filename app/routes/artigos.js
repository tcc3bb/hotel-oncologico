/** ROTAS DE ARTIGOS - ADMIN **/

console.log("Rotas de ARTIGOS carregadas!");


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
    const artigosDAO = new ArtigosDAO(connection);

    log('Consultando artigos no banco...');

    artigosDAO.listarTodos((err, artigos) => {
        if (err) {
            log('Erro ao listar artigos:', err);
            return res.status(500).send("Erro ao carregar artigos.");
        }

        log(`Artigos carregados com sucesso. Total: ${artigos.length}`);

        res.render('admin/painel_artigos', {
            admin: req.session.user,
            artigos
        });
    });
});

// =============================
// CRIAR NOVO ARTIGO
// =============================
router.post('/novo', verificaAdmin, upload.single('artigo_imagem_capa'), (req, res) => {
    log('Recebida requisição POST /admin/artigos');

    const connection = connectionFactory();

    // 1️⃣ PEGAR O USER ID DA SESSÃO (que SEMPRE EXISTE)
    const user_id = req.session.user.usuario_id || req.session.user.id;
    log('User logado:', user_id);

    // 2️⃣ CONSULTAR O ADMIN ID A PARTIR DO USER ID
    connection.query(
        "SELECT admin_id FROM admin WHERE usuario_id = ? LIMIT 1",
        [user_id],
        (err, resultadoAdmin) => {
            if (err) {
                log("Erro ao buscar admin_id:", err);
                return res.status(500).send("Erro ao buscar ID do administrador.");
            }

            if (resultadoAdmin.length === 0) {
                log("Nenhum administrador encontrado para esse usuario_id:", user_id);
                return res.status(403).send("Usuário não possui credenciais de administrador.");
            }

            const admin_id = resultadoAdmin[0].admin_id;
            log("Admin encontrado:", admin_id);

            // =============================
            // 🔥 CRIAÇÃO DO ARTIGO (com admin_id CORRETO)
            // =============================

            const artigosDAO = new ArtigosDAO(connection);

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

            const artigo_slug = gerarSlug(artigo_titulo);

            const artigo = {
                admin_id, // ← agora é o admin_id REAL
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

            log("Artigo montado:", artigo);

            artigosDAO.criarArtigo(artigo, (err, resultado) => {
                if (err) {
                    log("Erro ao criar artigo:", err);
                    return res.status(500).send("Erro ao criar artigo.");
                }

                log("Artigo criado com sucesso:", resultado.insertId);
                res.redirect("/admin/painel");
            });
        }
    );
});

// ==============================
// 🔥 ROTA PARA BUSCAR ARTIGO PÚBLICO POR ID
// ==============================
router.get('/public/:id', (req, res) => {
    const id = req.params.id;
    const connection = connectionFactory();
    const artigosDAO = new ArtigosDAO(connection);

    artigosDAO.buscarPorId(id, (erro, resultado) => {
        if (erro) {
            console.error("❌ ERRO ao buscar artigo:", erro);
            return res.status(500).json({ erro: "Erro ao buscar artigo." });
        }

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ erro: "Artigo não encontrado." });
        }

        const artigo = resultado[0];

        res.json({
            artigo_id: artigo.artigo_id,
            artigo_titulo: artigo.artigo_titulo,
            artigo_subtitulo: artigo.artigo_subtitulo,
            artigo_categoria: artigo.artigo_categoria,
            artigo_resumo: artigo.artigo_resumo,
            artigo_conteudo: artigo.artigo_conteudo,
            artigo_palavras_chave: artigo.artigo_palavras_chave,
            artigo_slug: artigo.artigo_slug,
            artigo_imagem_capa: artigo.artigo_imagem_capa,
            artigo_autor: artigo.artigo_autor,
            artigo_data_publicacao: artigo.artigo_data_publicacao
        });
    });
});

// =============================
// BUSCAR ARTIGO POR ID (para edição)
// =============================
router.get('/:id', verificaAdmin, (req, res) => {
    const artigo_id = req.params.id;
    const connection = connectionFactory();
    const artigosDAO = new ArtigosDAO(connection);

    artigosDAO.buscarPorId(artigo_id, (err, artigos) => {  // Renomeie para 'artigos' para clareza (é um array)
        if (err) {
            console.error("Erro ao buscar artigo:", err);
            return res.status(500).json({ erro: "Erro ao buscar artigo" });
        }

        if (!artigos || artigos.length === 0) {
            return res.status(404).json({ erro: "Artigo não encontrado" });
        }

        res.json(artigos[0]);  // ✅ Retorna apenas o objeto do artigo
    });
});


// =============================
// EDITAR ARTIGO
// =============================
router.put('/:id', verificaAdmin, upload.single('artigo_imagem_capa'), (req, res) => {
    const artigo_id = req.params.id;
    const connection = connectionFactory();
    const artigosDAO = new ArtigosDAO(connection);

    const {
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_categoria,
        artigo_slug
    } = req.body;

    const dadosAtualizados = {
        artigo_titulo,
        artigo_subtitulo,
        artigo_resumo,
        artigo_conteudo,
        artigo_palavras_chave,
        artigo_categoria,
        artigo_slug: artigo_slug || gerarSlug(artigo_titulo)
    };

    // se enviou nova imagem, atualiza
    if (req.file) {
        dadosAtualizados.artigo_imagem_capa = `/image/artigos/${req.file.filename}`;
    }

    artigosDAO.atualizarArtigo(artigo_id, dadosAtualizados, (err) => {
        if (err) {
            console.error("Erro ao atualizar artigo:", err);
            return res.status(500).send("Erro ao atualizar artigo.");
        }

        res.redirect('/admin/painel');
    });
});


// =============================
// EXCLUIR ARTIGO
// =============================
router.delete('/:id', verificaAdmin, (req, res) => {
    const artigo_id = req.params.id;

    const connection = connectionFactory();
    const artigosDAO = new ArtigosDAO(connection);

    artigosDAO.deletar(artigo_id, (err) => {
        if (err) {
            console.error("Erro ao deletar artigo:", err);
            return res.status(500).send("Erro ao excluir artigo.");
        }

        res.redirect('/admin/painel');
    });
});










module.exports = router;

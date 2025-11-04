module.exports = function (painelAdminDAO) {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const multer = require('multer');
    const path = require('path');
    const ArtigosDAO = require('../infra/ArtigosDAO');
    const connectionFactory = require('../infra/connectionFactory');
    const connection = connectionFactory();

    // CORREÇÃO: Adicionando 'new' se ArtigosDAO for uma classe
    const artigosDAO = ArtigosDAO(connection);
    const PerguntasDAO = require('../infra/PerguntasDAO');
    const perguntasDAO = new PerguntasDAO(connection);
    const reservasController = require('../controllers/reservasController');

    // CORREÇÃO PRINCIPAL: Removendo o '()' para importar a classe
    const ReservasDAO = require('../infra/ReservasDAO');


    // 🔹 Middleware: apenas admin pode acessar
    router.use((req, res, next) => {
        console.log('Middleware de autenticação admin: req.session.user =', req.session.user);
        if (!req.session.user || req.session.user.tipo !== 'admin') {
            console.log('Acesso negado: usuário não é admin ou não está logado');
            return res.status(403).send('Acesso negado');
        }
        next();
    });

    // 🔹 Página principal do painel (lista de usuários)
    // Rota para Gestão do Chat
    router.get('/painel', (req, res) => {
        painelAdminDAO.listarUsuarios((err, usuarios) => {
            if (err) return res.status(500).send('Erro ao listar usuários');

            artigosDAO.listarArtigos((err, artigos) => {
                if (err) return res.status(500).send('Erro ao listar artigos');

                perguntasDAO.listarComRespostas((err, perguntas) => {
                    if (err) return res.status(500).send('Erro ao listar perguntas');

                    // ✅ Buscar reservas antes de renderizar
                    const connection2 = require('../infra/connectionFactory')();

                    // CORREÇÃO: Usando o import da classe, não do require completo
                    // const ReservasDAO = require('../infra/ReservasDAO'); 
                    // ReservasDAO já foi importado no topo, podemos usar a variável
                    const reservasDAO = new ReservasDAO(connection2);


                    // CORREÇÃO: O método correto no DAO é 'listar', não 'listarTodas'
                    reservasDAO.listar((err, reservas) => {
                        connection2.end(); // Boa prática: fechar a conexão aqui
                        if (err) {
                            console.error('Erro ao listar reservas:', err);
                            return res.status(500).send('Erro ao listar reservas');
                        }

                        res.render('admin/painel', {
                            user: req.session.user,
                            usuarios,
                            artigos,
                            perguntas,
                            reservas
                        });
                    });
                });
            });
        });
    });



    // 🔹 Excluir usuário 
    router.post('/usuarios/:id/delete', (req, res) => {
        console.log('POST /usuarios/:id/delete chamado');
        console.log('Params:', req.params);
        console.log('Body:', req.body);
        console.log('Admin logado:', req.session.user);

        const { id } = req.params;
        const { senha } = req.body;

        if (!senha) {
            console.log('Erro: senha não fornecida');
            return res.status(400).send('Senha não fornecida');
        }

        console.log('Buscando senha do admin no banco...');
        painelAdminDAO.getSenhaAdmin(req.session.user.id, (err, results) => {
            if (err) {
                console.error('Erro ao buscar senha do admin:', err);
                return res.status(500).send('Erro interno');
            }
            if (results.length === 0) {
                console.error('Nenhum admin encontrado com ID:', req.session.user.id);
                return res.status(500).send('Erro interno');
            }

            const senhaHash = results[0].usuario_senha;
            console.log('Senha hash do admin encontrada:', senhaHash);

            bcrypt.compare(senha, senhaHash, (err, match) => {
                if (err) {
                    console.error('Erro ao comparar senha com bcrypt:', err);
                    return res.status(500).send('Erro interno');
                }
                if (!match) {
                    console.log('Senha incorreta');
                    return res.redirect('/admin/painel?erroSenha=1');
                }

                console.log('Senha correta. Excluindo usuário ID:', id);
                painelAdminDAO.excluirUsuario(id, (err) => {
                    if (err) {
                        console.error('Erro ao excluir usuário:', err);
                        return res.status(500).send('Erro ao excluir usuário');
                    }
                    console.log('Usuário excluído com sucesso:', id);
                    res.redirect('/admin/painel');
                });
            });
        });
    });

    // 🔹 Configuração do armazenamento
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'app/public/uploads/usuarios/');
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `usuario_${Date.now()}${ext}`);
        }
    });

    const upload = multer({ storage });

    // 🔹 Editar usuário
    router.post('/usuarios/:id/editar', upload.single('foto_perfil'), (req, res) => {
        console.log('POST /usuarios/:id/editar chamado');
        console.log('Params:', req.params);
        console.log('Body:', req.body);

        const { id } = req.params;
        const { tipo, estado } = req.body;
        const foto_perfil = req.file ? `/uploads/usuarios/${req.file.filename}` : null;

        if (!tipo || !estado) {
            console.log('Erro: dados incompletos', { tipo, estado });
            return res.status(400).send('Dados incompletos');
        }

        console.log('Atualizando usuário ID:', id);
        painelAdminDAO.atualizarUsuario(id, tipo, estado, foto_perfil, (err) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).send('Erro ao atualizar usuário');
            }
            console.log('Usuário atualizado com sucesso:', id);
            res.redirect('/admin/painel');
        });
    });


    // =========================================================
    // 🔹 GESTÃO DE CONTEÚDO (ARTIGOS)
    // =========================================================

    // Listar artigos
    router.get('/painel/artigos', (req, res) => {
        artigosDAO.listarArtigos((err, artigos) => {
            if (err) {
                console.error('Erro ao listar artigos:', err);
                return res.status(500).send('Erro ao listar artigos');
            }
            res.render('admin/painel', {
                user: req.session.user,
                artigos
            });
        });
    });

    // =====================================================
    // 🔹 Criar novo artigo
    // =====================================================
    router.post('/artigos/novo', multer({ dest: 'uploads/' }).single('artigo_imagem_capa'), (req, res) => {
        const connection = connectionFactory();

        // INSTANCIANDO O DAO CORRETAMENTE (se for uma classe)
        const artigosDAO = new ArtigosDAO(connection);

        const {
            artigo_titulo,
            artigo_subtitulo,
            artigo_categoria,
            artigo_resumo,
            artigo_conteudo,
            artigo_palavras_chave,
            artigo_slug
        } = req.body;

        const artigo_imagem_capa = req.file ? req.file.filename : null;

        // 1️⃣ Pegamos o ID do usuário logado
        const usuarioId = req.session.user.id;

        // 2️⃣ Buscamos o admin_id correspondente
        connection.query('SELECT admin_id FROM admin WHERE usuario_id = ?', [usuarioId], (err, results) => {
            connection.end(); // Fechar a conexão após a query
            if (err) {
                console.error('Erro ao buscar admin_id:', err);
                return res.status(500).send('Erro ao buscar administrador.');
            }

            if (results.length === 0) {
                console.error('Nenhum admin encontrado para o usuário:', usuarioId);
                return res.status(400).send('Administrador não encontrado.');
            }

            const adminId = results[0].admin_id;

            // 3️⃣ Criamos o artigo com o admin_id correto
            const artigo = {
                artigo_titulo,
                artigo_subtitulo,
                artigo_categoria,
                artigo_resumo,
                artigo_conteudo,
                artigo_palavras_chave,
                artigo_slug,
                artigo_status: 'rascunho',
                artigo_data_publicacao: new Date(),
                artigo_imagem_capa,
                admin_id: adminId // 🔹 agora é o ID correto (3)
            };

            artigosDAO.criarArtigo(artigo, (err) => {
                if (err) {
                    console.error('Erro ao criar artigo:', err);
                    return res.status(500).send('Erro ao criar artigo.');
                }
                res.redirect('/admin/painel');
            });
        });
    });

    // Editar artigo
    router.post('/artigos/:id/editar', upload.single('artigo_imagem_capa'), (req, res) => {
        const { id } = req.params;
        const dados = {
            artigo_titulo: req.body.artigo_titulo,
            artigo_subtitulo: req.body.artigo_subtitulo,
            artigo_resumo: req.body.artigo_resumo,
            artigo_conteudo: req.body.artigo_conteudo,
            artigo_imagem_capa: req.file ? `/uploads/artigos/${req.file.filename}` : req.body.artigo_imagem_capa_atual,
            artigo_imagens_extras: req.body.artigo_imagens_extras || null,
            artigo_slug: req.body.artigo_slug,
            artigo_palavras_chave: req.body.artigo_palavras_chave,
            artigo_descricao_meta: req.body.artigo_descricao_meta,
            artigo_categoria: req.body.artigo_categoria,
            artigo_tags: req.body.artigo_tags,
            artigo_status: req.body.artigo_status,
            artigo_data_publicacao: req.body.artigo_data_publicacao || null,
            artigo_destacado: req.body.artigo_destacado ? 1 : 0,
            artigo_aprovado_admin: req.body.artigo_aprovado_admin ? 1 : 0,
            artigo_observacoes_internas: req.body.artigo_observacoes_internas
        };

        artigosDAO.atualizarArtigo(id, dados, (err) => {
            if (err) return res.status(500).send('Erro ao atualizar artigo');
            res.redirect('/admin/painel');
        });
    });

    // Excluir artigo
    router.post('/artigos/:id/delete', (req, res) => {
        const { id } = req.params;
        artigosDAO.excluirArtigo(id, (err) => {
            if (err) {
                console.error('Erro ao excluir artigo:', err);
                return res.status(500).send('Erro ao excluir artigo');
            }
            res.redirect('/admin/painel');
        });
    });


    router.get('/reservas', reservasController.listar);
    router.get('/reservas/nova', reservasController.formNova);
    router.post('/reservas/nova', reservasController.salvar);
    router.get('/reservas/editar/:id', reservasController.editarForm);
    router.post('/reservas/editar/:id', reservasController.atualizar);
    router.get('/reservas/deletar/:id', reservasController.deletar);

    return router;
};

module.exports = function (painelAdminDAO) {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const multer = require('multer');
    const path = require('path');
    const ArtigosDAO = require('../infra/ArtigosDAO');
    const connectionFactory = require('../infra/connectionFactory');
    const connection = connectionFactory();
    const artigosDAO = new ArtigosDAO(connection);
    const PainelAdminDAO = require('../infra/PainelAdminDAO');
    const PerguntasDAO = require('../infra/PerguntasDAO');
    const perguntasDAO = new PerguntasDAO(connection);
    const reservasController = require('../controllers/reservasController');
    const ReservasDAO = require('../infra/ReservasDAO');
    const DoacaoDAO = require('../infra/DoacaoDAO');


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
        const usuarioId = req.session.user.id;

        // 🔥 BUSCAR INFORMAÇÕES DO ADMIN
        painelAdminDAO.getAdminByUsuarioId(usuarioId, (err, adminInfo) => {
            if (err) {
                console.error("Erro ao buscar admin:", err);
                return res.status(500).send("Erro ao carregar informações do admin");
            }

            const admin = adminInfo || {};

            painelAdminDAO.listarUsuarios((err, usuarios) => {
                if (err) return res.status(500).send('Erro ao listar usuários');

                artigosDAO.listarArtigos((err, artigos) => {
                    if (err) return res.status(500).send('Erro ao listar artigos');

                    perguntasDAO.listarComRespostas((err, perguntas) => {
                        if (err) return res.status(500).send('Erro ao listar perguntas');

                        const connection2 = require('../infra/connectionFactory')();
                        const reservasDAO = new ReservasDAO(connection2);

                        reservasDAO.listar((err, reservas) => {
                            if (err) {
                                console.error('Erro ao listar reservas:', err);
                                return res.status(500).send('Erro ao listar reservas');
                            }

                            const connection3 = require('../infra/connectionFactory')();
                            const doacaoDAO = new DoacaoDAO(connection3);

                            doacaoDAO.listarTodas((err, doacoes) => {
                                connection3.end();

                                if (err) {
                                    console.error('Erro ao listar doações:', err);
                                    return res.status(500).send('Erro ao listar doações');
                                }

                                res.render('admin/painel', {
                                    user: req.session.user,
                                    admin,       // <<<< 🔥 AGORA EXISTE
                                    usuarios,
                                    artigos,
                                    perguntas,
                                    reservas,
                                    doacoes
                                });
                            });
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


// 🔹 GESTÃO DE CONTEÚDO (ARTIGOS) - MODIFICAR PARA BUSCAR ADMIN
router.get('/painel/artigos', (req, res) => {
    const usuarioId = req.session.user.id;
    painelAdminDAO.getAdminByUsuarioId(usuarioId, (err, adminInfo) => {
        if (err) {
            console.error("Erro ao buscar admin:", err);
            return res.status(500).send("Erro ao carregar informações do admin");
        }
        const admin = adminInfo || {};
        
        artigosDAO.listarArtigos((err, artigos) => {
            if (err) {
                console.error('Erro ao listar artigos:', err);
                return res.status(500).send('Erro ao listar artigos');
            }
            res.render('admin/painel', {
                user: req.session.user,
                admin,  // <<<< ADICIONADO
                artigos,
                usuarios: [],  // Adicionar listas vazias para consistência
                perguntas: [],
                reservas: [],
                doacoes: []
            });
        });
    });
});


    router.get('/reservas', reservasController.listar);
    router.get('/reservas/nova', reservasController.formNova);
    router.post('/reservas/nova', reservasController.salvar);
    router.get('/reservas/editar/:id', reservasController.editarForm);
    router.post('/reservas/editar/:id', reservasController.atualizar);
    router.get('/reservas/deletar/:id', reservasController.deletar);

    // =========================
    // GESTÃO DE DOAÇÕES — ADMIN
    // =========================
    router.get("/doacoes", (req, res) => {
    const usuarioId = req.session.user.id;
    painelAdminDAO.getAdminByUsuarioId(usuarioId, (err, adminInfo) => {
        if (err) {
            console.error("Erro ao buscar admin:", err);
            return res.status(500).send("Erro ao carregar informações do admin");
        }
        const admin = adminInfo || {};
        
        const connection = connectionFactory();
        const DoacaoDAO = require("../infra/DoacaoDAO");
        const dao = new DoacaoDAO(connection);

        dao.listarTodas((err, doacoes) => {
            connection.end();
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao buscar doações.");
            }
            res.render("admin/painel", {
                user: req.session.user,  // <<<< ADICIONADO
                admin,  // <<<< ADICIONADO
                usuarios: [],
                artigos: [],
                perguntas: [],
                reservas: [],
                doacoes: doacoes
            });
        });
    });
});

    return router;
};

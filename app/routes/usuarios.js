const express = require('express');
const bcrypt = require('bcryptjs');
const connectionFactory = require('../infra/connectionFactory');
const UsuariosDAO = require('../infra/UsuariosDAO');

module.exports = () => {
    const router = express.Router();
    const connection = connectionFactory();
    const usuariosDAO = new UsuariosDAO(connection);

    // Cadastro (já existente)
    router.get('/cadastro', (req, res) => {
        res.render('usuarios/cadastro', {
            usuario: {},
            user: req.session.user,
            action: '/usuarios/cadastro',
            erro: null
        });
    });

    router.post('/cadastro', (req, res) => {
        console.log('Dados recebidos no cadastro:', req.body);
        const { email, senha, confirma_senha, tipo } = req.body;
        console.log('Tipo:', tipo);

        if (!email || !senha || !confirma_senha || !tipo) {
            return res.render('usuarios/cadastro', { erro: 'Todos os campos devem ser preenchidos.', usuario: req.body });
        }

        if (senha !== confirma_senha) {
            return res.render('usuarios/cadastro', { erro: 'As senhas não conferem.', usuario: req.body });
        }

        // Validação do tipo de usuário
        const tiposValidos = ['paciente', 'acompanhante', 'voluntario', 'doador', 'admin'];
        if (!tiposValidos.includes(tipo)) {
            return res.render('usuarios/cadastro', { erro: 'Tipo de usuário inválido.', usuario: req.body });
        }

        usuariosDAO.buscarPorEmail(email, (err, results) => {
            if (err) {
                return res.render('usuarios/cadastro', {
                    erro: 'Erro ao consultar banco de dados.',
                    usuario: req.body,
                    user: req.session.user
                });
            }

            if (results.length > 0) {
                return res.render('usuarios/cadastro', {
                    erro: 'E-mail já cadastrado.',
                    usuario: req.body,
                    user: req.session.user
                });
            }

            bcrypt.hash(senha, 10, (err, hash) => {
                if (err) {
                    return res.render('usuarios/cadastro', { erro: 'Erro ao criptografar senha.', usuario: req.body });
                }

                usuariosDAO.salvar({
                    usuario_email: email,
                    usuario_senha: hash,
                    usuario_tipo: tipo
                }, (err, result) => {
                    if (err) {
                        console.error("Erro ao salvar usuário:", err);
                        return res.render('usuarios/cadastro', { erro: 'Erro ao salvar usuário.', usuario: req.body });
                    }

                    const usuarioId = result.insertId;

                    // Redireciona para o questionário específico
                    switch (tipo) {
                        case 'paciente':
                            res.redirect(`/questionarios/paciente/${usuarioId}`);
                            break;
                        case 'acompanhante':
                            res.redirect(`/questionarios/acompanhante/${usuarioId}`);
                            break;
                        case 'voluntario':
                            res.redirect(`/questionarios/voluntario/${usuarioId}`);
                            break;
                        case 'doador':
                            res.redirect(`/questionarios/doador/${usuarioId}`);
                            break;
                        case 'admin':
                            res.redirect(`/questionarios/admin/${usuarioId}`);
                            break;
                        default:
                            res.redirect('/usuarios/login');
                    }
                });

            });
        });
    });

    // Login - GET
    router.get('/login', (req, res) => {
        res.render('usuarios/login', { erro: null, usuario: {}, user: req.session.user, action: '/usuarios/login' });
    });

    // Login - POST
    // Login - POST
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('usuarios/login', {
                erro: 'Preencha e-mail e senha.',
                usuario: { email: email || '' },
                user: req.session.user
            });
        }

        usuariosDAO.buscarPorEmail(email, (err, results) => {
            if (err) {
                console.error('Erro no login:', err);
                return res.render('usuarios/login', {
                    erro: 'Erro ao tentar fazer login. Tente novamente.',
                    usuario: { email },
                    user: req.session.user
                });
            }

            if (results.length === 0) {
                return res.render('usuarios/login', {
                    erro: 'E-mail ou senha inválidos.',
                    usuario: { email },
                    user: req.session.user
                });
            }

            const usuario = results[0];

            // Compara a senha com o hash armazenado
            bcrypt.compare(password, usuario.usuario_senha, (err, igual) => {
                if (err) {
                    console.error('Erro ao comparar senha:', err);
                    return res.render('usuarios/login', {
                        erro: 'Erro ao validar senha.',
                        usuario: { email },
                        user: req.session.user
                    });
                }

                if (!igual) {
                    return res.render('usuarios/login', {
                        erro: 'E-mail ou senha inválidos.',
                        usuario: { email },
                        user: req.session.user
                    });
                }

                // Login bem-sucedido: cria sessão
                req.session.user = {
                    id: usuario.usuario_id,
                    email: usuario.usuario_email,
                    tipo: usuario.usuario_tipo
                };

                // Atualiza o último login no banco
                const agora = new Date();
                const updateSql = `UPDATE usuario SET usuario_ultimo_login = ? WHERE usuario_id = ?`;
                connection.query(updateSql, [agora, usuario.usuario_id], (err2) => {
                    if (err2) console.error('Erro ao atualizar último login:', err2);
                });

                res.redirect('/');
            });
        });
    });

    // Logout 
    router.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });

    // Login - GET
    router.get('/esqueci-senha', (req, res) => {
        res.render('usuarios/esqueci-senha', { erro: null, sucesso: null });
    });

    // Login - GET 
    router.get('/resetar-senha', (req, res) => {
        return res.render('usuarios/resetar-senha', { erro: 'Token inválido ou expirado.', token: null, sucesso: null });
    });

    return router;
};

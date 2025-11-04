const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const connectionFactory = require('../infra/connectionFactory');
const UsuariosDAO = require('../infra/UsuariosDAO');
const PasswordResetDAO = require('../infra/PasswordResetDAO');

require('dotenv').config();

module.exports = () => {
    const router = express.Router();
    const connection = connectionFactory();
    const usuariosDAO = new UsuariosDAO(connection);
    const passwordResetDAO = new PasswordResetDAO(connection);

    // Form para solicitar reset (GET)
    router.get('/esqueci-senha', (req, res) => {
        res.render('usuarios/esqueci-senha', { erro: null, sucesso: null });
    });

    // Enviar email com token (POST)
    router.post('/esqueci-senha', (req, res) => {
        const email = (req.body.email || '').trim();

        if (!email) {
            return res.render('usuarios/esqueci-senha', { erro: 'Informe o e-mail.', sucesso: null });
        }

        usuariosDAO.buscarPorEmail(email, (err, results) => {
            if (err) {
                console.error('Erro DB buscarPorEmail:', err);
                return res.render('usuarios/esqueci-senha', { erro: 'Erro no servidor. Tente novamente.', sucesso: null });
            }

            if (!results || results.length === 0) {
                // por segurança: não revelar que e-mail não existe
                return res.render('usuarios/esqueci-senha', { erro: null, sucesso: 'Se o e-mail existir, você receberá instruções.' });
            }

            const usuario = results[0];

            // Gerar token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

            passwordResetDAO.salvar({
                user_id: usuario.id,
                token: token,
                expires_at: expiresAt
            }, (errInsert) => {
                if (errInsert) {
                    console.error('Erro DB salvar token:', errInsert);
                    return res.render('usuarios/esqueci-senha', { erro: 'Erro no servidor. Tente novamente.', sucesso: null });
                }

                // Preparar transporte de e-mail
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false, // TLS STARTTLS
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                const resetUrl = `${process.env.APP_URL}/resetar-senha?token=${token}`;

                const mailOptions = {
                    from: `"${process.env.FROM_NAME || 'Suporte'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
                    to: usuario.email,
                    subject: 'Redefinição de senha',
                    html: `
            <p>Você (ou alguém que solicitou) pediu para redefinir a senha da sua conta.</p>
            <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Se você não solicitou, ignore este e-mail.</p>
          `
                };

                transporter.sendMail(mailOptions, (mailErr, info) => {
                    if (mailErr) {
                        console.error('Erro ao enviar email:', mailErr);
                        return res.render('usuarios/esqueci-senha', { erro: 'Não foi possível enviar o e-mail. Contate o suporte.', sucesso: null });
                    }

                    return res.render('usuarios/esqueci-senha', { erro: null, sucesso: 'Se o e-mail existir, você receberá instruções para redefinir a senha.' });
                });
            });
        });
    });

    // Form para reset (GET) - token via query param
    router.get('/resetar-senha', (req, res) => {
        const token = req.query.token;
        if (!token) return res.redirect('/usuarios/login');

        // opcional: buscar token para validar e já mostrar erro se inválido/expirado
        passwordResetDAO.buscarPorToken(token, (err, results) => {
            if (err) {
                console.error('Erro DB buscarPorToken:', err);
                return res.render('usuarios/resetar-senha', { erro: 'Erro no servidor.', token: null });
            }

            if (!results || results.length === 0) {
                return res.render('usuarios/resetar-senha', { erro: 'Token inválido ou expirado.', token: null, sucesso: null });
            }

            const pr = results[0];
            if (pr.used || new Date(pr.expires_at) < new Date()) {
                return res.render('usuarios/resetar-senha', { erro: 'Token inválido ou expirado.', token: null, sucesso: null  });
            }

            res.render('usuarios/resetar-senha', { erro: null, token: token, sucesso: null });

        });
    });

    // Recebe nova senha (POST)
    router.post('/resetar-senha', (req, res) => {
        const { token, senha, confirmar } = req.body;

        if (!token || !senha) {
            return res.render('usuarios/resetar-senha', { erro: 'Dados incompletos.', token: token || null });
        }
        if (senha !== confirmar) {
            return res.render('usuarios/resetar-senha', { erro: 'Senhas não conferem.', token });
        }
        if (senha.length < 6) {
            return res.render('usuarios/resetar-senha', { erro: 'Use uma senha com pelo menos 6 caracteres.', token });
        }

        passwordResetDAO.buscarPorToken(token, (err, results) => {
            if (err) {
                console.error('Erro DB buscarPorToken:', err);
                return res.render('usuarios/resetar-senha', { erro: 'Erro no servidor.', token: null, sucesso: null  });
            }

            if (!results || results.length === 0) {
                return res.render('usuarios/resetar-senha', { erro: 'Token inválido ou expirado.', token: null, sucesso: null  });
            }

            const pr = results[0];
            if (pr.used || new Date(pr.expires_at) < new Date()) {
                return res.render('usuarios/resetar-senha', { erro: 'Token inválido ou expirado.', token: null, sucesso: null  });
            }

            // Hash da nova senha
            bcrypt.hash(senha, 10, (hashErr, hash) => {
                if (hashErr) {
                    console.error('Erro ao hashear senha:', hashErr);
                    return res.render('usuarios/resetar-senha', { erro: 'Erro ao processar senha.', token: null });
                }

                const usuarioId = pr.user_id;

                usuariosDAO.atualizarSenha(usuarioId, hash, (updateErr, updateRes) => {
                    if (updateErr) {
                        console.error('Erro DB atualizarSenha:', updateErr);
                        return res.render('usuarios/resetar-senha', { erro: 'Erro no servidor.', token: null });
                    }

                    passwordResetDAO.marcarComoUsado(token, (marcarErr) => {
                        if (marcarErr) console.error('Erro marcarComoUsado:', marcarErr);
                        // sucesso — redireciona para login com mensagem
                        return res.render('usuarios/resetar-senha', { erro: null, token: null, sucesso: 'Senha alterada com sucesso. Você já pode entrar.' });
                    });
                });
            });
        });
    });

    return router;
};

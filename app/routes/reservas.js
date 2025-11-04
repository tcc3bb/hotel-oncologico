// reservas.js
const express = require('express');
const router = express.Router();
const connectionFactory = require('../infra/connectionFactory');
const verificaLogin = require('../middlewares/verificaLogin');
const ReservasDAO = require('../infra/ReservasDAO');

// =======================
// LISTAR RESERVAS
// =======================
router.get('/reservas', (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    dao.listar((erro, resultados) => {
        connection.end();
        if (erro) {
            console.error('Erro ao listar reservas:', erro);
            return res.status(500).send('Erro ao buscar reservas');
        }
        res.render('reservas/lista-reservas', { reservas: resultados });
    });
});

// =======================
// FORMULÁRIO NOVA RESERVA (com escolha de quarto) - CORRIGIDO
// =======================
router.get('/reservas/nova', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    dao.listarQuartosComFotos((erro, quartos) => {
        connection.end();
        if (erro) {
            console.error('Erro ao buscar quartos:', erro);
            return res.status(500).send('Erro ao carregar quartos disponíveis: ' + erro.message);
        }
        const flashMessage = req.flash('erro') || req.flash('sucesso'); 
        res.render('reservas/nova-reserva', { 
            user: req.session.user, 
            quartos: quartos,
            flashMessage: flashMessage 
        });
    });
});

// =======================
// SALVAR NOVA RESERVA - CORRIGIDO (Adicionado tratamento de erro/sucesso para flash)
// =======================
// reservas.js - Dentro de router.post('/reservas/nova', ...)
router.post('/reservas/nova', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const reserva = req.body;
    
    console.log('Dados do usuário na sessão:', req.session.user); // Adicione este log!

    if (req.session.user.tipo === 'paciente') {
        reserva.paciente_id = req.session.user.id;
        console.log('ID do Paciente a ser salvo:', reserva.paciente_id); // Adicione este log!
    } else {
        // Lidar com casos onde o usuário logado não é paciente, se necessário
        console.error('Usuário logado não é um paciente para fazer a reserva.');
        req.flash('erro', 'Apenas pacientes podem fazer reservas.');
        connection.end();
        return res.redirect('/reservas/nova');
    }
    // Campos obrigatórios que devem ser passados pelo form
    if (!reserva.quarto_id || !reserva.reserva_data_checkin_previsto || !reserva.reserva_data_checkout_previsto) {
        req.flash('erro', 'Todos os campos obrigatórios (quarto e datas) devem ser preenchidos.');
        connection.end();
        return res.redirect('/reservas/nova');
    }
    // Valores padrão ou calculados que faltavam no seu POST, mas são not null no BD
    reserva.reserva_status = 'pendente'; // Status inicial de uma reserva feita pelo paciente
    reserva.reserva_num_hospedes = 1; // Padrão, ajuste se necessário
    reserva.reserva_valor_diaria = 0.00; // Padrão, ajuste se necessário
    reserva.reserva_valor_servicos = 0.00; // Padrão, ajuste se necessário
    reserva.reserva_valor_total = 0.00; // Padrão, ajuste se necessário
    reserva.reserva_desconto = 0.00; // Padrão, ajuste se necessário
    reserva.reserva_admin_aprovou = 0; // Padrão, até que um admin aprove
    dao.salvar(reserva, (erro) => {
        connection.end();
        if (erro) {
            console.error('Erro ao salvar reserva:', erro.message);
            req.flash('erro', `Erro ao salvar a reserva: ${erro.message}`);
            return res.redirect('/reservas/nova');
        }
        req.flash('sucesso', 'Reserva criada com sucesso e aguardando confirmação!');
        res.redirect('/paciente/minhas-reservas'); 
    });
});

// =======================
// EDITAR RESERVA
// =======================
router.post('/reservas/editar/:id', (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const id = req.params.id;
    const reserva = req.body;
    dao.atualizar(id, reserva, (erro) => {
        connection.end();
        if (erro) {
            console.error('Erro ao atualizar reserva:', erro);
            return res.status(500).send('Erro ao atualizar reserva');
        }
        res.redirect('/admin/painel');
    });
});

// =======================
// DELETAR RESERVA
// =======================
router.get('/reservas/deletar/:id', (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const id = req.params.id;
    dao.deletar(id, (erro) => {
        connection.end();
        if (erro) {
            console.error('Erro ao deletar reserva:', erro);
            return res.status(500).send('Erro ao deletar reserva');
        }
        res.redirect('/admin/painel');
    });
});

module.exports = (app) => app.use('/', router);

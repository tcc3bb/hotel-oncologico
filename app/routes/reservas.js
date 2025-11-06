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
// SALVAR NOVA RESERVA - CORRIGIDO (COM BUSCA DO ID DO PACIENTE)
// =======================
router.post('/reservas/nova', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const reserva = req.body;

    console.log('Dados do usuário na sessão:', req.session.user);

    if (req.session.user.tipo !== 'paciente') {
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

    // 1. BUSCAR O paciente_id CORRETO USANDO O usuario_id DA SESSÃO
    dao.buscarPacienteIdPorUsuarioId(req.session.user.id, (erroBusca, pacienteId) => {
        if (erroBusca) {
            console.error('Erro ao buscar paciente_id:', erroBusca.message);
            req.flash('erro', `Erro interno: ${erroBusca.message}`);
            connection.end();
            return res.redirect('/reservas/nova');
        }

        reserva.paciente_id = pacienteId;
        console.log('ID do Paciente CORRETO a ser salvo:', reserva.paciente_id);

        const acompanhanteEmail = reserva.acompanhante_email;

        // Buscar acompanhante, se informado
        if (acompanhanteEmail && acompanhanteEmail.trim() !== '') {
            dao.buscarAcompanhanteIdPorEmail(acompanhanteEmail, (erroAcomp, acompanhanteId) => {
                if (erroAcomp) {
                    console.error('Erro ao buscar acompanhante por e-mail:', erroAcomp.message);
                    req.flash('erro', `Erro ao buscar acompanhante: ${erroAcomp.message}`);
                    connection.end();
                    return res.redirect('/reservas/nova');
                }

                if (!acompanhanteId && acompanhanteEmail) {
                    console.warn('E-mail de acompanhante informado não encontrado:', acompanhanteEmail);
                    req.flash('erro', 'Nenhum acompanhante encontrado com o e-mail informado.');
                    connection.end();
                    return res.redirect('/reservas/nova');
                }

                reserva.acompanhante_id = acompanhanteId || null;
                salvarReserva();

            });
        } else {
            reserva.acompanhante_id = null;
            salvarReserva();
        }

        function salvarReserva() {
            // Remove campos que não pertencem à tabela 'reserva'
            delete reserva.reserva_periodo;
            delete reserva.acompanhante_email; // ✅ Remove o campo do formulário que não existe no banco

            // Define os campos obrigatórios
            reserva.reserva_status = 'pendente';
            reserva.reserva_num_hospedes = 1;
            reserva.reserva_valor_diaria = 0.00;
            reserva.reserva_valor_servicos = 0.00;
            reserva.reserva_valor_total = 0.00;
            reserva.reserva_desconto = 0.00;
            reserva.reserva_admin_aprovou = 0;

            // Validação de datas
            if (!reserva.reserva_data_checkin_previsto || !reserva.reserva_data_checkout_previsto) {
                req.flash('erro', 'Você deve selecionar as datas de check-in e check-out.');
                connection.end();
                return res.redirect('/reservas/nova');
            }

            // Agora salva corretamente no banco
            dao.salvar(reserva, (erroSalvar) => {
                connection.end();
                if (erroSalvar) {
                    console.error('Erro ao salvar reserva:', erroSalvar.message);
                    req.flash('erro', `Erro ao salvar a reserva: ${erroSalvar.message}`);
                    return res.redirect('/reservas/nova');
                }
                req.flash('sucesso', 'Reserva criada com sucesso e aguardando confirmação!');
                res.redirect('/paciente/minhas-reservas');
            });
        }
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

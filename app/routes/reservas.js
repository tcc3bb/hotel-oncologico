// reservas.js
const express = require('express');
const router = express.Router();
const connectionFactory = require('../infra/connectionFactory');
const verificaLogin = require('../middlewares/verificaLogin');
const ReservasDAO = require('../infra/ReservasDAO');

// =======================
// LISTAR RESERVAS (TODAS)
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
// FORMULÁRIO NOVA RESERVA (com escolha de quarto)
// =======================
router.get('/reservas/nova', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);

    dao.buscarTiposDisponiveis((erroTipos, tipos) => {
        if (erroTipos) {
            connection.end();
            console.error("Erro ao carregar tipos:", erroTipos);
            return res.status(500).send("Erro ao carregar tipos de quarto");
        }

        dao.buscarFotosPorTipo((erroFotos, fotos) => {
            connection.end();
            if (erroFotos) {
                console.error("Erro ao carregar fotos:", erroFotos);
                return res.status(500).send("Erro ao carregar fotos");
            }

            // Anexa as fotos ao tipo
            tipos.forEach(t => {
                t.fotos = fotos.filter(f => f.tipo_quarto_id === t.tipo_quarto_id);
            });

            const flashMessage = req.flash('erro') || req.flash('sucesso');

            res.render('reservas/nova-reserva', {
                user: req.session.user,
                tipos: tipos,
                flashMessage: flashMessage
            });
        });
    });
});


// =======================
// SALVAR NOVA RESERVA
// =======================
router.post('/reservas/nova', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const reserva = req.body;

    if (req.session.user.tipo !== 'paciente') {
        req.flash('erro', 'Apenas pacientes podem fazer reservas.');
        connection.end();
        return res.redirect('/reservas/nova');
    }

    if (!reserva.tipo_quarto_id ||
        !reserva.reserva_data_checkin_previsto ||
        !reserva.reserva_data_checkout_previsto) {

        req.flash('erro', 'Selecione o tipo de quarto e as datas.');
        connection.end();
        return res.redirect('/reservas/nova');
    }

    // 1. BUSCA O paciente_id usando o usuario_id da sessão
    dao.buscarPacienteIdPorUsuarioId(req.session.user.id, (erroBusca, pacienteId) => {
        if (erroBusca) {
            req.flash('erro', `Erro interno: ${erroBusca.message}`);
            connection.end();
            return res.redirect('/reservas/nova');
        }

        reserva.paciente_id = pacienteId;

        const acompanhanteEmail = reserva.acompanhante_email;

        // 2. BUSCA acompanhante se informado
        if (acompanhanteEmail && acompanhanteEmail.trim() !== '') {
            dao.buscarAcompanhanteIdPorEmail(acompanhanteEmail, (erroAcomp, acompanhanteId) => {
                if (erroAcomp) {
                    req.flash('erro', `Erro ao buscar acompanhante: ${erroAcomp.message}`);
                    connection.end();
                    return res.redirect('/reservas/nova');
                }


                if (!acompanhanteId) {
                    req.flash('erro', 'Nenhum acompanhante encontrado com o e-mail informado.');
                    connection.end();
                    return res.redirect('/reservas/nova');
                }

                reserva.acompanhante_id = acompanhanteId;

                // 3. AGORA BUSCA UM QUARTO AUTOMATICAMENTE
                selecionarQuartoEGuardar();
            });
        } else {
            reserva.acompanhante_id = null;
            selecionarQuartoEGuardar();
        }

        // ============================================
        // BUSCA O PRIMEIRO QUARTO DISPONÍVEL DO TIPO
        // ============================================
        function selecionarQuartoEGuardar() {
            dao.buscarQuartoDisponivelPorTipo(reserva.tipo_quarto_id, (erroQuarto, resultado) => {
                if (erroQuarto || resultado.length === 0) {
                    req.flash('erro', 'Nenhum quarto disponível neste tipo.');
                    connection.end();
                    return res.redirect('/reservas/nova');
                }

                // Coloca o quarto escolhido automaticamente
                reserva.quarto_id = resultado[0].quarto_id;

                salvarReserva();
            });
        }

        // ============================================
        // SALVA A RESERVA
        // ============================================
        function salvarReserva() {

            delete reserva.reserva_periodo;
            delete reserva.acompanhante_email;
            delete reserva.tipo_quarto_id;  
            reserva.reserva_status = 'pendente';
            reserva.reserva_num_hospedes = 1;
            reserva.reserva_valor_diaria = 0.00;
            reserva.reserva_valor_servicos = 0.00;
            reserva.reserva_valor_total = 0.00;
            reserva.reserva_desconto = 0.00;
            reserva.reserva_admin_aprovou = 0;

            dao.salvar(reserva, (erroSalvar) => {
                connection.end();
                if (erroSalvar) {
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
// CANCELAR RESERVA
// =======================
router.post('/reservas/cancelar/:id', verificaLogin, (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);

    dao.atualizarStatus(req.params.id, "cancelada", (erro) => {
        connection.end();
        if (erro) {
            console.error("Erro ao cancelar reserva:", erro);
            return res.status(500).send("Erro ao cancelar reserva");
        }

        res.status(200).send("OK");
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
            console.error('Erro ao atualizar reserva:', erro);a
            return res.status(500).send('Erro ao atualizar reserva');
        }
        res.redirect('/admin/painel');
    });
});

module.exports = (app) => app.use('/', router);
const express = require("express");
const router = express.Router();

const connectionFactory = require("../infra/connectionFactory");
const DoacaoDAO = require("../infra/DoacaoDAO");
const DoadorDAO = require("../infra/DoadorDAO");
const verificaLogin = require("../middlewares/verificaLogin");

// ===========================
// RENDERIZAR FORMULÁRIO
// ===========================
router.get("/nova", verificaLogin, (req, res) => {
    res.render("doador/nova-doacao", {
        errors: [],
        success: null,
        user: req.session.user || null
    });
});


// ===========================
// SALVAR DOAÇÃO
// ===========================
// Converter string vazia para null
function toNullIfEmpty(valor) {
    return (valor === '' || valor == null) ? null : valor;
}

router.post("/nova", verificaLogin, (req, res) => {
    const conn = connectionFactory();
    const dao = new DoacaoDAO(conn);

    const usuarioId = req.session.user.id;
    const tipoDoacao = req.body.doacao_tipo; // Financeira, Produto ou Alimento

    // buscar doador_id omitido aqui para foco no objeto doacao

    // construir o objeto doacao conforme o tipo
    let doacao = {
        doador_id: null, // vai setar depois
        doacao_tipo: tipoDoacao,
        doacao_status: "Pendente",
        doacao_destino: toNullIfEmpty(req.body.doacao_destino),
        doacao_recorrencia: req.body.doacao_recorrencia || "Única",
        servico_tipo: toNullIfEmpty(req.body.servico_tipo)
    };

    if (tipoDoacao === "Financeira") {
        doacao.doacao_valor = toNullIfEmpty(req.body.doacao_valor);
        doacao.doacao_metodo_pagamento = toNullIfEmpty(req.body.doacao_metodo_pagamento);
        // outros campos nulos
        doacao.doacao_categoria_item = null;
        doacao.doacao_quantidade = null;
        doacao.doacao_unidade = null;
        doacao.doacao_condicao = null;

    } else if (tipoDoacao === "Produto") {
        doacao.doacao_categoria_item = toNullIfEmpty(req.body.produto_categoria_item);
        doacao.doacao_quantidade = toNullIfEmpty(req.body.produto_quantidade);
        doacao.doacao_condicao = toNullIfEmpty(req.body.doacao_condicao);

        // Outros campos nulos
        doacao.doacao_valor = null;
        doacao.doacao_metodo_pagamento = null;

    } else if (tipoDoacao === "Alimento") {
        doacao.doacao_categoria_item = toNullIfEmpty(req.body.alimento_categoria_item);
        doacao.doacao_quantidade = toNullIfEmpty(req.body.alimento_quantidade);
        doacao.doacao_unidade = toNullIfEmpty(req.body.alimento_unidade);

        // outros campos nulos
        doacao.doacao_valor = null;
        doacao.doacao_metodo_pagamento = null;
        doacao.doacao_condicao = null;
    }

    // buscar doadorId pelo usuarioId ... Depois setar
    const sql = "SELECT doador_id FROM doador WHERE usuario_id = ?";
    conn.query(sql, [usuarioId], (err, resultado) => {
        if (err || resultado.length === 0) {
            conn.end();
            console.log("Erro ao localizar doador:", err);
            return res.render("doador/nova-doacao", {
                errors: ["Não foi possível localizar seu perfil de doador."],
                success: null
            });
        }

        doacao.doador_id = resultado[0].doador_id;

        dao.salvar(doacao, (err2) => {
            conn.end();

            if (err2) {
                console.log("Erro ao salvar doação:", err2);
                return res.render("doador/nova-doacao", {
                    errors: ["Erro ao registrar doação. Tente novamente."],
                    success: null
                });
            }

            res.render("doador/nova-doacao", {
                errors: [],
                success: "Doação registrada com sucesso! Aguarde aprovação."
            });
        });
    });
});


// ===========================
// PAINEL DO DOADOR (LISTAGEM)
// ===========================
router.get("/minhas", verificaLogin, (req, res) => {
    const conn = connectionFactory();
    const doadorDAO = new DoadorDAO(conn);
    const doacaoDAO = new DoacaoDAO(conn);

    const usuarioId = req.session.user.id;

    const filtros = {
        tipo: req.query.tipo || null,
        mes: req.query.mes || null,
        ano: req.query.ano || null
    };

    const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';

    doadorDAO.buscarPorUsuarioId(usuarioId, (err, resultadoDoadorId) => {

        if (err || resultadoDoadorId.length === 0) {
            conn.end();

            if (isAjax) {
                return res.json({
                    erro: true,
                    mensagem: "Não foi possível localizar o perfil do doador."
                });
            }

            return res.send("Erro: não foi possível localizar o perfil do doador.");
        }

        const doadorId = resultadoDoadorId[0].doador_id;

        doadorDAO.buscarDadosCompletos(usuarioId, (erro, dadosCompletos) => {

            if (erro || !dadosCompletos) {
                conn.end();

                if (isAjax) {
                    return res.json({
                        erro: true,
                        mensagem: "Não foi possível carregar os dados do perfil."
                    });
                }

                return res.send("Erro: não foi possível localizar o perfil do doador.");
            }

            doacaoDAO.listarFiltrado(doadorId, filtros, (err2, doacoes) => {

                if (err2) {
                    conn.end();

                    if (isAjax) {
                        return res.json({
                            erro: true,
                            mensagem: "Erro ao buscar doações."
                        });
                    }

                    return res.send("Erro ao buscar doações.");
                }

                // Calcular totais
                let totalMes = 0;
                let totalAno = 0;
                let totalGeral = 0;
                const anoAtual = new Date().getFullYear();
                const mesAtual = new Date().getMonth() + 1;

                doacoes.forEach(d => {
                    const data = new Date(d.doacao_data);
                    const valor = parseFloat(d.doacao_valor) || 0;

                    if (d.doacao_tipo === "Financeira") {
                        totalGeral += valor;
                        if (data.getFullYear() === anoAtual) {
                            totalAno += valor;
                            if (data.getMonth() + 1 === mesAtual) {
                                totalMes += valor;
                            }
                        }
                    }
                });

                const totais = {
                    totalMes: totalMes.toFixed(2),
                    totalAno: totalAno.toFixed(2),
                    totalGeral: totalGeral.toFixed(2),
                    ranking: "Top 10% dos Doadores"
                };

                conn.end();

                // SE FOR AJAX → responde JSON
                if (isAjax) {
                    return res.json({ doacoes, totais });
                }

                // acesso normal (renderizar página)
                res.render("doador/minhas-doacoes", { doacoes, totais });
            });
        });
    });
});



module.exports = router;

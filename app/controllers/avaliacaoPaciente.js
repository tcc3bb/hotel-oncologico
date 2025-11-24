const dbConnection = require('../infra/connectionFactory');
const AvaliacaoPacienteDAO = require('../infra/AvaliacaoPacienteDAO');

class AvaliacaoPacienteController {

    index(req, res) {
        console.log("📌 [AVALIACAO] GET /paciente/avaliacoes chamado");

        const usuarioId = req.session.user.id;
        const connection = dbConnection();
        const dao = new AvaliacaoPacienteDAO(connection);

        // IMPORTAR DAO
        const PacienteDAO = require('../infra/PacienteDAO');
        const pacienteDAO = new PacienteDAO(connection);

        const ReservaDAO = require('../infra/ReservasDAO');
        const reservaDAO = new ReservaDAO(connection);

        // Buscar dados do paciente
        pacienteDAO.buscarDadosCompletos(usuarioId, (err, pacienteResult) => {
            if (err) {
                console.error("❌ ERRO ao buscar dados do paciente:", err);
                connection.end();
                return res.send("Erro ao carregar seus dados.");
            }

            const paciente = pacienteResult[0]; // ✅ AGORA SIM, declarado ANTES

            reservaDAO.listarPorPaciente(paciente.paciente_id, (erro2, reservas) => {
                if (erro2) {
                    console.error("❌ ERRO ao listar reservas:", erro2);
                    connection.end();
                    return res.send("Erro ao carregar suas reservas.");
                }

                dao.listarPorPaciente(paciente.paciente_id, (erro, avaliacoes) => {
                    if (erro) {
                        console.error("❌ ERRO listarPorPaciente:", erro);
                        connection.end();
                        return res.send("Erro ao carregar avaliações.");
                    }

                    const msgSucesso = req.session.msgSucessoAvaliacao;
                    req.session.msgSucessoAvaliacao = null; // limpar

                    res.render("paciente/minhas-reservas", {
                        avaliacoes,
                        paciente,
                        reservas,
                        secaoAtiva: "avaliacao",
                        user: req.session.user,
                        msgSucesso // envia para o ejs
                    });


                    connection.end();
                });
            });
        });
    }


    salvar(req, res) {
        console.log("📌 [AVALIACAO] POST /paciente/avaliacoes chamado");
        console.log("📌 Sessão:", req.session.user);

        const usuarioId = req.session.user.id;
        const { avaliacao_nota, avaliacao_comentario } = req.body;

        if (!avaliacao_nota) {
            console.error("❌ ERRO: nota não recebida!");
            return res.send("Erro ao salvar avaliação.");
        }

        const connection = dbConnection();
        const pacienteDAO = new (require("../infra/PacienteDAO"))(connection);

        // 1️⃣ BUSCA O paciente_id CORRETO
        pacienteDAO.buscarPacienteIdPorUsuarioId(usuarioId, (erro, pacienteId) => {
            if (erro) {
                console.error("❌ ERRO MySQL buscarPacienteId:", erro);
                connection.end();
                return res.send("Erro ao salvar avaliação.");
            }

            if (!pacienteId) {
                console.error("❌ Usuário logado não possui paciente_id!");
                connection.end();
                return res.send("Erro ao salvar avaliação.");
            }

            console.log("📌 paciente_id encontrado:", pacienteId);

            const dados = {
                paciente_id: pacienteId,
                nota: avaliacao_nota,
                comentario: avaliacao_comentario
            };

            console.log("📌 Dados a serem inseridos:", dados);

            const avaliacaoDAO = new AvaliacaoPacienteDAO(connection);

            // 2️⃣ SALVA A AVALIAÇÃO COM O paciente_id REAL
            avaliacaoDAO.salvar(dados, (erro2, resultado) => {
                if (erro2) {
                    console.error("❌ ERRO MySQL ao salvar avaliação:", erro2);
                    connection.end();
                    return res.send("Erro ao salvar avaliação.");
                }

                console.log("✅ Avaliação salva com sucesso!", resultado);

                req.session.msgSucessoAvaliacao = "Avaliação enviada com sucesso!"; // ✅ AQUI
                connection.end();
                return res.redirect("/paciente/avaliacoes");
            });

        });
    }

}

module.exports = new AvaliacaoPacienteController();

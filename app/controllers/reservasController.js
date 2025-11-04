const connectionFactory = require('../infra/connectionFactory');
// CORREÇÃO: Removemos o '()' para importar a classe ReservasDAO corretamente.
const ReservasDAO = require('../infra/ReservasDAO');

exports.listar = (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);

    dao.listar((erro, resultados) => {
        // CORREÇÃO: Mova connection.end() para DENTRO do callback
        // para garantir que a consulta termine antes de fechar a conexão.
        connection.end();

        if (erro) {
            console.error('Erro ao listar reservas:', erro);
            return res.status(500).send('Erro ao buscar reservas');
        }
        res.render('reservas/lista-reservas', { reservas: resultados });
    });

    // REMOVIDO: O connection.end() foi movido para dentro do callback
    // connection.end();
};

exports.formNova = (req, res) => {
    res.render('reservas/nova-reserva');
};

exports.salvar = (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const reserva = req.body;

    dao.salvar(reserva, (erro) => {
        connection.end();
        if (erro) {
            console.error('Erro ao salvar reserva:', erro);
            return res.status(500).send('Erro ao salvar reserva');
        }
        res.redirect('/reservas');
    });
};

exports.editarForm = (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const id = req.params.id;

    dao.buscarPorId(id, (erro, resultados) => {
        connection.end();
        if (erro || resultados.length === 0) {
            return res.status(404).send('Reserva não encontrada');
        }
        res.render('reservas/editar-reserva', { reserva: resultados[0] });
    });
};

exports.atualizar = (req, res) => {
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
        res.redirect('/reservas');
    });
};

exports.deletar = (req, res) => {
    const connection = connectionFactory();
    const dao = new ReservasDAO(connection);
    const id = req.params.id;

    dao.deletar(id, (erro) => {
        connection.end();
        if (erro) {
            console.error('Erro ao deletar reserva:', erro);
            return res.status(500).send('Erro ao deletar reserva');
        }
        res.redirect('/reservas');
    });
};

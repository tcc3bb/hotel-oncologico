/**
 * DAO para operações no banco de dados relacionadas a Reservas.
 * @param {object} connection - Objeto de conexão com o banco de dados.
 */
function ReservasDAO(connection) {
    this._connection = connection;
}

/* =========================
    LISTAR TODAS AS RESERVAS (COM JOIN DE INFORMAÇÕES RELACIONADAS)
    ========================= */
ReservasDAO.prototype.listar = function (callback) {
    const sql = `
        SELECT r.*, 
            p.paciente_nome, 
            a.acompanhante_nome, 
            q.quarto_numero,
            ad.admin_nome
        FROM reserva r
        LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
        LEFT JOIN acompanhante a ON r.acompanhante_id = a.acompanhante_id
        LEFT JOIN quarto q ON r.quarto_id = q.quarto_id
        LEFT JOIN admin ad ON r.admin_id = ad.admin_id
        ORDER BY r.reserva_data_criacao DESC;
    `;
    this._connection.query(sql, callback);
};

/* =========================
    BUSCAR PRIMEIRO QUARTO DISPONÍVEL
    ========================= */
ReservasDAO.prototype.buscarQuartoDisponivel = function (callback) {
    const sql = `SELECT quarto_id FROM quarto 
                WHERE quarto_status = 'disponivel' 
                ORDER BY quarto_id ASC 
                LIMIT 1`;
    this._connection.query(sql, callback);
};

/* =========================
    ATUALIZAR STATUS DO QUARTO
    ========================= */
ReservasDAO.prototype.atualizarStatusQuarto = function (quartoId, novoStatus, callback) {
    const sql = `UPDATE quarto SET quarto_status = ? WHERE quarto_id = ?`;
    this._connection.query(sql, [novoStatus, quartoId], callback);
};

/* =========================
    BUSCAR RESERVA POR ID
    ========================= */
ReservasDAO.prototype.buscarPorId = function (id, callback) {
    const sql = `SELECT * FROM reserva WHERE reserva_id = ?`;
    this._connection.query(sql, [id], callback);
};

/* =========================
    LISTAR QUARTOS COM SUAS FOTOS
    ========================= */
// ESSA FUNÇÃO ESTAVA CORRETA E É USADA NO NOVO 'reservas.js'
ReservasDAO.prototype.listarQuartosComFotos = function (callback) {
    const sqlQuartos = `
        SELECT q.*, tq.tipo_quarto_nome, tq.tipo_quarto_descricao
        FROM quarto q
        JOIN tipo_quarto tq ON q.tipo_quarto_id = tq.tipo_quarto_id
        WHERE q.quarto_status = 'disponivel'
        ORDER BY q.quarto_numero ASC;
    `;
    this._connection.query(sqlQuartos, (erro, quartos) => {
        if (erro) {
            console.error('Erro ao buscar quartos:', erro);
            return callback(erro);
        }
        if (!quartos || quartos.length === 0) {
            console.warn('Nenhum quarto disponível encontrado.');
            return callback(null, []);
        }
        const sqlFotos = `SELECT * FROM quarto_fotos WHERE quarto_id = ? ORDER BY foto_ordem`;
        let processados = 0;
        const total = quartos.length;
        quartos.forEach((quarto, i) => {
            this._connection.query(sqlFotos, [quarto.quarto_id], (erro2, fotos) => {
                if (erro2) {
                    console.error(`Erro ao buscar fotos do quarto ID ${quarto.quarto_id}:`, erro2);
                    quartos[i].fotos = [];
                } else {
                    quartos[i].fotos = fotos;
                    if (fotos.length === 0) {
                        console.warn(`Quarto ID ${quarto.quarto_id} sem fotos no banco.`);
                    }
                }
                processados++;
                // Quando todos terminarem
                if (processados === total) {
                    console.log('Consulta de quartos finalizada com sucesso.');
                    callback(null, quartos);
                }
            });
        });
    });
};

/* =========================
    SALVAR NOVA RESERVA (com verificação de quarto)
    ========================= */
// ESSA FUNÇÃO ESTAVA CORRETA E É ACIONADA PELO NOVO FORM
ReservasDAO.prototype.salvar = function (reserva, callback) {
    const self = this;
    // 1️⃣ Verifica se o quarto ainda está disponível
    const sqlCheck = `SELECT quarto_status FROM quarto WHERE quarto_id = ?`;
    this._connection.query(sqlCheck, [reserva.quarto_id], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao verificar status do quarto:', erro);
            return callback(erro);
        }
        if (resultados.length === 0) {
            return callback(new Error('Quarto não encontrado.'));
        }
        const status = resultados[0].quarto_status;
        if (status !== 'disponivel') {
            // Bloqueia a reserva duplicada
            return callback(new Error('O quarto selecionado não está disponível.'));
        }
        // 2️⃣ Salva a reserva
        const sqlInsert = `INSERT INTO reserva SET ?`;
        self._connection.query(sqlInsert, reserva, (erro2, resultadoInsert) => {
            if (erro2) return callback(erro2);
            // 3️⃣ Atualiza status do quarto para "reservado"
            const sqlUpdate = `UPDATE quarto SET quarto_status = 'reservado' WHERE quarto_id = ?`;
            self._connection.query(sqlUpdate, [reserva.quarto_id], (erro3) => {
                if (erro3) return callback(erro3);
                callback(null, resultadoInsert);
            });
        });
    });
};

/* =========================
ATUALIZAR RESERVA EXISTENTE
========================= */
ReservasDAO.prototype.atualizar = function (id, reserva, callback) {
    const sql = `UPDATE reserva SET ? WHERE reserva_id = ?`;
    this._connection.query(sql, [reserva, id], callback);
};

/* =========================
DELETAR RESERVA
========================= */
ReservasDAO.prototype.deletar = function (id, callback) {
    const sql = `DELETE FROM reserva WHERE reserva_id = ?`;
    this._connection.query(sql, [id], callback);
};

module.exports = ReservasDAO;
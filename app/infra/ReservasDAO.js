function ReservasDAO(connection) {
    this._connection = connection;
}

/* =========================
   BUSCAR ID DO PACIENTE PELO ID DO USUÁRIO
    ========================= */
ReservasDAO.prototype.buscarPacienteIdPorUsuarioId = function (usuarioId, callback) {
    const sql = `SELECT paciente_id FROM paciente WHERE usuario_id = ?`;
    this._connection.query(sql, [usuarioId], (erro, resultados) => {
        if (erro) {
            return callback(erro);
        }
        if (resultados.length === 0) {
            return callback(new Error('Paciente não encontrado para este usuário.'));
        }
        // Retorna apenas o paciente_id
        callback(null, resultados[0].paciente_id);
    });
};

/* =========================
    BUSCAR ACOMPANHANTE_ID PELO E-MAIL
   ========================= */
/**
 * Busca o acompanhante_id a partir do e-mail informado,
 * usando o vínculo entre as tabelas usuario → acompanhante.
 */
ReservasDAO.prototype.buscarAcompanhanteIdPorEmail = function (email, callback) {
    const sql = `
        SELECT a.acompanhante_id
        FROM acompanhante a
        JOIN usuario u ON a.usuario_id = u.usuario_id
        WHERE u.usuario_email = ? AND u.usuario_tipo = 'acompanhante'
        LIMIT 1;
    `;
    this._connection.query(sql, [email], (erro, resultados) => {
        if (erro) return callback(erro);
        if (resultados.length === 0) return callback(null, null);
        callback(null, resultados[0].acompanhante_id);
    });
};


/* =========================
   LISTAR TODAS AS RESERVAS (COM JOIN DE INFORMAÇÕES RELACIONADAS)
   ========================= */
ReservasDAO.prototype.listar = function (callback) {
    const sql = `
        SELECT 
            r.reserva_id,
            r.paciente_id,
            p.paciente_nome,
            r.acompanhante_id,
            a.acompanhante_nome,
            r.quarto_id,
            q.quarto_numero,
            r.reserva_status,
            r.reserva_data_checkin_previsto,
            r.reserva_data_checkout_previsto,
            r.reserva_data_criacao
        FROM reserva r
        LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
        LEFT JOIN acompanhante a ON r.acompanhante_id = a.acompanhante_id
        LEFT JOIN quarto q ON r.quarto_id = q.quarto_id
        ORDER BY r.reserva_data_criacao DESC;
    `;

    console.log('Executando SQL listar reservas...');
    this._connection.query(sql, (erro, resultados) => {
        if (erro) {
            console.error('❌ Erro SQL listar reservas:', erro.sqlMessage || erro);
            return callback(erro);
        }
        console.log(`✅ ${resultados.length} reservas encontradas.`);
        callback(null, resultados);
    });
};

// Buscar tipos de quarto com pelo menos 1 quarto disponível
ReservasDAO.prototype.buscarTiposDisponiveis = function (callback) {
    const sql = `
        SELECT 
            tq.tipo_quarto_id,
            tq.tipo_quarto_nome,
            tq.tipo_quarto_descricao,
            COUNT(q.quarto_id) AS total_quartos,
            SUM(q.quarto_status = 'disponivel') AS quartos_disponiveis
        FROM tipo_quarto tq
        LEFT JOIN quarto q 
            ON q.tipo_quarto_id = tq.tipo_quarto_id
        WHERE tq.tipo_quarto_status = 'ativo'
        GROUP BY tq.tipo_quarto_id
        HAVING quartos_disponiveis > 0
    `;
    this._connection.query(sql, callback);
}

ReservasDAO.prototype.buscarFotosPorTipo = function (callback) {
    const sql = `
        SELECT 
            tipo_quarto_id,
            foto_caminho,
            foto_ordem
        FROM quarto_fotos
        ORDER BY foto_ordem ASC
    `;
    this._connection.query(sql, callback);
}

ReservasDAO.prototype.buscarQuartoDisponivelPorTipo = function (tipoId, callback) {
    const sql = `
        SELECT quarto_id 
        FROM quarto 
        WHERE tipo_quarto_id = ? 
        AND quarto_status = 'disponivel'
        ORDER BY quarto_id ASC
        LIMIT 1
    `;
    this._connection.query(sql, [tipoId], callback);
}

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




// Atualizar status da reserva
ReservasDAO.prototype.atualizarStatus = function (id, status, callback) {
    const sql = `UPDATE reserva SET reserva_status = ? WHERE raeserva_id = ?`;
    this._connection.query(sql, [status, id], callback);
};

/* =========================
LISTAR RESERVAS POR PACIENTE
========================= */
ReservasDAO.prototype.listarPorPaciente = function (pacienteId, callback) {
    const sql = `
        SELECT 
            r.reserva_id,
            r.paciente_id,
            p.paciente_nome,
            r.acompanhante_id,
            a.acompanhante_nome,
            r.quarto_id,
            q.quarto_numero,
            r.reserva_status,
            r.reserva_data_checkin_previsto,
            r.reserva_data_checkout_previsto,
            r.reserva_data_criacao
        FROM reserva r
        LEFT JOIN paciente p ON r.paciente_id = p.paciente_id
        LEFT JOIN acompanhante a ON r.acompanhante_id = a.acompanhante_id
        LEFT JOIN quarto q ON r.quarto_id = q.quarto_id
        WHERE r.paciente_id = ?
        ORDER BY r.reserva_data_criacao DESC
    `;

    this._connection.query(sql, [pacienteId], callback);
};

ReservasDAO.prototype.buscarDetalhes = function (id, callback) {
    const sql = `
        SELECT 
            r.*,
            p.paciente_nome,
            a.acompanhante_nome,
            q.quarto_numero,
            tq.tipo_quarto_id,
            tq.tipo_quarto_nome,
            tq.tipo_quarto_descricao,
            tq.tipo_quarto_capacidade,
            tq.tipo_quarto_valor,
            f.foto_caminho
        FROM reserva r
        LEFT JOIN paciente p ON p.paciente_id = r.paciente_id
        LEFT JOIN acompanhante a ON a.acompanhante_id = r.acompanhante_id
        LEFT JOIN quarto q ON q.quarto_id = r.quarto_id
        LEFT JOIN tipo_quarto tq ON tq.tipo_quarto_id = q.tipo_quarto_id
        LEFT JOIN quarto_fotos f ON f.tipo_quarto_id = tq.tipo_quarto_id
        WHERE r.reserva_id = ?
    `;

    this._connection.query(sql, [id], (err, results) => {
        if (err) return callback(err);

        if (!results.length) return callback(null, []);

        // ⚠️ Como vem várias linhas (1 por foto), precisamos consolidar:
        const base = { ...results[0], fotos: [] };

        results.forEach(r => {
            if (r.foto_caminho) base.fotos.push(r.foto_caminho);
        });

        // Retorna a reserva consolidada dentro de um array
        callback(null, [base]);
    });
};

module.exports = ReservasDAO;
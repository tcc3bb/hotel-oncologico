class DoacaoDAO {
    constructor(connection) {
        this._connection = connection;
    }

    listarPorDoador(doadorId, callback) {
        const sql = `
            SELECT * FROM doacao
            WHERE doador_id = ?
            ORDER BY doacao_data DESC
        `;
        this._connection.query(sql, [doadorId], callback);
    }

    salvar(doacao, callback) {
        const sql = "INSERT INTO doacao SET ?";
        this._connection.query(sql, doacao, callback);
    }

    buscarPorId(doacaoId, callback) {
        const sql = "SELECT * FROM doacao WHERE doacao_id = ?";
        this._connection.query(sql, [doacaoId], callback);
    }

    atualizarStatus(doacaoId, novoStatus, callback) {
        const sql = "UPDATE doacao SET doacao_status = ? WHERE doacao_id = ?";
        this._connection.query(sql, [novoStatus, doacaoId], callback);
    }

    listarFiltrado(doadorId, filtros, callback) {

        let sql = `
        SELECT *
        FROM doacao
        WHERE doador_id = ?
    `;
        const params = [doadorId];

        // filtro de tipo
        if (filtros.tipo) {
            sql += " AND doacao_tipo = ?";
            params.push(filtros.tipo);
        }

        // filtro de mês (1-12)
        if (filtros.mes) {
            sql += " AND MONTH(doacao_data) = ?";
            params.push(filtros.mes);
        }

        // filtro de ano (YYYY)
        if (filtros.ano) {
            sql += " AND YEAR(doacao_data) = ?";
            params.push(filtros.ano);
        }

        sql += " ORDER BY doacao_data DESC";

        this._connection.query(sql, params, callback);
    }

    calcularTotais(doadorId, callback) {
        const sql = `
        SELECT 
            COALESCE(SUM(CASE WHEN MONTH(doacao_data) = MONTH(CURRENT_DATE()) 
                            AND YEAR(doacao_data) = YEAR(CURRENT_DATE()) 
                            THEN doacao_valor END), 0) AS totalMes,
            COALESCE(SUM(CASE WHEN YEAR(doacao_data) = YEAR(CURRENT_DATE()) 
                            THEN doacao_valor END), 0) AS totalAno
        FROM doacao
        WHERE doador_id = ?
    `;

        this._connection.query(sql, [doadorId], (erro, resultados) => {
            if (erro) return callback(erro);
            callback(null, resultados[0]);
        });
    }


}



module.exports = DoacaoDAO;

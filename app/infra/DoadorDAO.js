class DoadorDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
        SELECT 
            d.*,
            u.usuario_email,
            DATE_FORMAT(d.doador_data_nascimento, '%Y-%m-%d') AS doador_data_nascimento
        FROM doador d
        INNER JOIN usuario u ON u.usuario_id = d.usuario_id
        WHERE d.usuario_id = ?
    `;

        this._connection.query(sql, [usuarioId], (erro, resultados) => {
            if (erro) return callback(erro);
            callback(null, resultados[0]);
        });
    }


    atualizarDados(usuarioId, dados, callback) {
        // Definir campos PF e PJ
        const camposPF = [
            'doador_nome', 'doador_cpf', 'doador_rg',
            'doador_data_nascimento', 'doador_sexo', 'doador_telefone'
        ];

        const camposPJ = [
            'doador_nome_empresa', 'doador_area_atuacao_empresa',
            'doador_cnpj', 'doador_telefone_empresa',
            'doador_representante', 'doador_cpf_representante'
        ];

        const camposEndereco = [
            'doador_logradouro', 'doador_numero', 'doador_complemento',
            'doador_bairro', 'doador_cidade', 'doador_estado', 'doador_cep'
        ];

        const updates = [];
        const valores = [];

        // PF ou PJ
        if (dados.doador_tipo === 'Pessoa Física') {
            [...camposPF, ...camposEndereco].forEach(campo => {
                if (dados[campo] !== undefined && dados[campo] !== null)
                    updates.push(`${campo} = ?`), valores.push(dados[campo]);
            });
        } else {
            [...camposPJ, ...camposEndereco].forEach(campo => {
                if (dados[campo] !== undefined && dados[campo] !== null)
                    updates.push(`${campo} = ?`), valores.push(dados[campo]);
            });
        }

        // Tipo sempre pode mudar
        updates.push(`doador_tipo = ?`);
        valores.push(dados.doador_tipo);

        const sql = `UPDATE doador SET ${updates.join(', ')} WHERE usuario_id = ?`;

        valores.push(usuarioId);

        this._connection.query(sql, valores, callback);
    }

    excluir(usuarioId, callback) {
        const sql = `DELETE FROM usuario WHERE usuario_id = ?`;

        this._connection.query(sql, [usuarioId], callback);
    }

    buscarPorUsuarioId(usuarioId, callback) {
        const sql = "SELECT doador_id FROM doador WHERE usuario_id = ?";
        this._connection.query(sql, [usuarioId], callback);
    }
}

module.exports = DoadorDAO;

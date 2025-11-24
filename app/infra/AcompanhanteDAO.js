class AcompanhanteDAO {
    constructor(connection) {
        this._connection = connection;
    }

    buscarDadosCompletos(usuarioId, callback) {
        const sql = `
            SELECT 
                a.*, 
                u.usuario_id, u.usuario_email, u.usuario_tipo
            FROM acompanhante a
            JOIN usuario u ON a.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
        `;
        this._connection.query(sql, [usuarioId], callback);
    }

    atualizarDados(usuarioId, dados, callback) {
        // Somente campos que realmente existem na tabela acompanhante
        const camposValidos = [
            "acompanhante_nome",
            "acompanhante_cpf",
            "acompanhante_rg",
            "acompanhante_data_nascimento",
            "acompanhante_sexo",
            "acompanhante_parentesco",
            "acompanhante_telefone",
            "acompanhante_endereco",
            "acompanhante_numero",
            "acompanhante_complemento",
            "acompanhante_cidade",
            "acompanhante_estado",
            "acompanhante_observacoes"
        ];

        const dadosFiltrados = {};
        for (const campo of camposValidos) {
            if (dados[campo] !== undefined) {
                dadosFiltrados[campo] = dados[campo];
            }
        }

        // Atualiza pelo usuario_id (que é UNIQUE na tabela)
        const sql = `
        UPDATE acompanhante
        SET ?
        WHERE usuario_id = ?
    `;

        this._connection.query(sql, [dadosFiltrados, usuarioId], callback);
    }


    excluirConta(usuarioId, callback) {
        this._connection.query(
            'DELETE FROM usuario WHERE usuario_id = ?',
            [usuarioId],
            callback
        );
    }

    buscarPorUsuarioId(usuarioId, callback) {
        const sql = `
        SELECT *
        FROM acompanhante
        WHERE usuario_id = ?
    `;
        this._connection.query(sql, [usuarioId], callback);
    }
}

module.exports = AcompanhanteDAO;

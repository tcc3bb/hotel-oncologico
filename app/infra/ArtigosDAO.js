module.exports = (connection) => {
    return {
        // 🔹 Listar todos os artigos
        listarArtigos(callback) {
            const sql = `
                SELECT a.*, ad.admin_nome 
                FROM artigo a
                JOIN admin ad ON a.admin_id = ad.admin_id
                ORDER BY a.artigo_data_criacao DESC
            `;
            connection.query(sql, callback);
        },

        // 🔹 Obter artigo específico pelo ID
        buscarPorId(artigo_id, callback) {
            const sql = `
        SELECT a.*, ad.admin_nome AS artigo_autor
        FROM artigo a
        JOIN admin ad ON a.admin_id = ad.admin_id
        WHERE a.artigo_id = ?
    `;
            connection.query(sql, [artigo_id], callback);
        }, 

        // 🔹 Criar novo artigo
        criarArtigo(artigo, callback) {
            const sql = `
        INSERT INTO artigo (
            artigo_titulo, 
            artigo_subtitulo,
            artigo_categoria,
            artigo_resumo,
            artigo_conteudo,
            artigo_palavras_chave,
            artigo_slug,
            artigo_status,
            artigo_data_publicacao,
            artigo_imagem_capa,
            admin_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
            const values = [
                artigo.artigo_titulo,
                artigo.artigo_subtitulo,
                artigo.artigo_categoria,
                artigo.artigo_resumo,
                artigo.artigo_conteudo,
                artigo.artigo_palavras_chave,
                artigo.artigo_slug,
                artigo.artigo_status,
                artigo.artigo_data_publicacao,
                artigo.artigo_imagem_capa,
                artigo.admin_id
            ];
            connection.query(sql, values, callback); // ← AQUI está o ajuste
        },


        // 🔹 Atualizar artigo existente
        atualizarArtigo(artigo_id, dados, callback) {
            const sql = `
                UPDATE artigo SET
                    artigo_titulo = ?, artigo_subtitulo = ?, artigo_resumo = ?,
                    artigo_conteudo = ?, artigo_imagem_capa = ?, artigo_imagens_extras = ?,
                    artigo_slug = ?, artigo_palavras_chave = ?, artigo_descricao_meta = ?,
                    artigo_categoria = ?, artigo_tags = ?, artigo_status = ?,
                    artigo_data_publicacao = ?, artigo_destacado = ?, 
                    artigo_aprovado_admin = ?, artigo_observacoes_internas = ?
                WHERE artigo_id = ?
            `;
            const values = [
                dados.artigo_titulo,
                dados.artigo_subtitulo,
                dados.artigo_resumo,
                dados.artigo_conteudo,
                dados.artigo_imagem_capa,
                dados.artigo_imagens_extras,
                dados.artigo_slug,
                dados.artigo_palavras_chave,
                dados.artigo_descricao_meta,
                dados.artigo_categoria,
                dados.artigo_tags,
                dados.artigo_status,
                dados.artigo_data_publicacao,
                dados.artigo_destacado,
                dados.artigo_aprovado_admin,
                dados.artigo_observacoes_internas,
                artigo_id
            ];
            connection.query(sql, values, callback);
        },

        // 🔹 Incrementar visualização de artigo
        incrementarVisualizacao(artigo_id, callback) {
            const sql = `
                UPDATE artigo 
                SET artigo_visualizacoes = artigo_visualizacoes + 1 
                WHERE artigo_id = ?
            `;
            connection.query(sql, [artigo_id], callback);
        },

        // 🔹 Excluir artigo
        excluirArtigo(artigo_id, callback) {
            const sql = `DELETE FROM artigo WHERE artigo_id = ?`;
            connection.query(sql, [artigo_id], callback);
        }
    };
};

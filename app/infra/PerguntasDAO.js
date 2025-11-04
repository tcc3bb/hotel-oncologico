function PerguntasDAO(connection) {
    this._connection = connection;
}

/* =========================
   LISTAR PERGUNTAS COM NOME CORRETO DO AUTOR
   ========================= */
PerguntasDAO.prototype.listar = function (callback) {
    this._connection.query(`
        SELECT 
            p.pergunta_id,
            p.usuario_id,
            p.pergunta_titulo,
            p.pergunta_conteudo,
            p.pergunta_status,
            p.pergunta_curtidas,
            p.pergunta_visualizacoes,
            p.pergunta_aprovada_admin,
            p.pergunta_data_criacao,
            p.pergunta_data_atualizacao,
            p.pergunta_editada,
            p.pergunta_editada_por,
            p.pergunta_deletada,
            p.pergunta_ip_criacao,

CASE u.usuario_tipo
    WHEN 'admin' THEN COALESCE(a.admin_nome, 'Usuário')
    WHEN 'paciente' THEN COALESCE(pa.paciente_nome, 'Usuário')
    WHEN 'acompanhante' THEN COALESCE(ac.acompanhante_nome, 'Usuário')
    WHEN 'voluntario' THEN COALESCE(v.voluntario_nome, 'Usuário')
    WHEN 'doador' THEN COALESCE(d.doador_nome, 'Usuário')
    ELSE 'Usuário'
END AS autor_nome


        FROM pergunta p
        JOIN usuario u ON p.usuario_id = u.usuario_id
        LEFT JOIN admin a ON u.usuario_id = a.usuario_id
        LEFT JOIN paciente pa ON u.usuario_id = pa.usuario_id
        LEFT JOIN acompanhante ac ON u.usuario_id = ac.usuario_id
        LEFT JOIN voluntario v ON u.usuario_id = v.usuario_id
        LEFT JOIN doador d ON u.usuario_id = d.usuario_id

        WHERE p.pergunta_deletada = 0
        ORDER BY p.pergunta_data_criacao DESC
    `, callback);
};

/* =========================
   INSERIR NOVA PERGUNTA
   ========================= */
PerguntasDAO.prototype.inserirPergunta = function (dados, callback) {
    this._connection.query("INSERT INTO pergunta SET ?", dados, callback);
};

/* =========================
   INSERIR NOVA RESPOSTA
   ========================= */
PerguntasDAO.prototype.inserirResposta = function (dados, callback) {
    this._connection.query("INSERT INTO resposta SET ?", dados, callback);
};

/* =========================
   LISTAR RESPOSTAS DE UMA PERGUNTA (com nome correto do autor)
   ========================= */
PerguntasDAO.prototype.listarRespostas = function (perguntaId, callback) {
    this._connection.query(`
        SELECT 
            r.resposta_id,
            r.pergunta_id,
            r.usuario_id,
            r.resposta_conteudo,
            r.resposta_pai_id,
            r.resposta_status,
            r.resposta_curtidas,
            r.resposta_visualizacoes,
            r.resposta_aprovada_admin,
            r.resposta_data_criacao,
            r.resposta_data_atualizacao,
            r.resposta_editada,
            r.resposta_editada_por,
            r.resposta_deletada,
            r.resposta_ip_criacao,
            r.resposta_observacoes,

CASE u.usuario_tipo
    WHEN 'admin' THEN COALESCE(a.admin_nome, 'Usuário')
    WHEN 'paciente' THEN COALESCE(pa.paciente_nome, 'Usuário')
    WHEN 'acompanhante' THEN COALESCE(ac.acompanhante_nome, 'Usuário')
    WHEN 'voluntario' THEN COALESCE(v.voluntario_nome, 'Usuário')
    WHEN 'doador' THEN COALESCE(d.doador_nome, 'Usuário')
    ELSE 'Usuário'
END AS autor_nome


        FROM resposta r
        JOIN usuario u ON r.usuario_id = u.usuario_id
        LEFT JOIN admin a ON u.usuario_id = a.usuario_id
        LEFT JOIN paciente pa ON u.usuario_id = pa.usuario_id
        LEFT JOIN acompanhante ac ON u.usuario_id = ac.usuario_id
        LEFT JOIN voluntario v ON u.usuario_id = v.usuario_id
        LEFT JOIN doador d ON u.usuario_id = d.usuario_id

        WHERE r.pergunta_id = ?
          AND r.resposta_deletada = 0
          AND r.resposta_status = 'publicada'
        ORDER BY r.resposta_data_criacao ASC
    `, [perguntaId], callback);
};

/* =========================
   LISTAR PERGUNTAS + RESPOSTAS
   ========================= */
PerguntasDAO.prototype.listarComRespostas = function (callback) {
    const self = this;

    this.listar((erro, perguntas) => {
        if (erro) return callback(erro);
        if (perguntas.length === 0) return callback(null, []);

        let count = 0;
        perguntas.forEach((p) => {
            self.listarRespostas(p.pergunta_id, (erro2, respostas) => {
                if (erro2) return callback(erro2);

                p.respostas = respostas;
                count++;
                if (count === perguntas.length) {
                    callback(null, perguntas);
                }
            });
        });
    });
};

module.exports = PerguntasDAO;

    const connectionFactory = require('../infra/connectionFactory'); // Ajuste o caminho

    function verificaLogin(req, res, next) {
        if (!req.session || !req.session.user) {
            req.flash('erro', 'Sessão expirada. Faça login novamente.');
            return res.redirect('/usuarios/login');
        }

        // Verifica se o usuário ainda existe no banco
        const connection = connectionFactory();
        const sql = 'SELECT usuario_id FROM usuario WHERE usuario_id = ? AND usuario_status = "ativo"'; // Ajuste conforme sua tabela
        connection.query(sql, [req.session.user.id], (erro, resultados) => {
            connection.end();
            if (erro || resultados.length === 0) {
                req.session.destroy(); // Limpa a sessão inválida
                req.flash('erro', 'Usuário inválido. Faça login novamente.');
                return res.redirect('/usuarios/login');
            }
            next();
        });
    }
    
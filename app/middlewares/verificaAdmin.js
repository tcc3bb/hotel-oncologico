module.exports = function verificaAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ erro: 'Você precisa estar logado.' });
    }

    if (req.session.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    next();
};


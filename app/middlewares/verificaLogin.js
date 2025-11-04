function verificaLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        // Usuário não logado → redireciona para login
        return res.redirect('/usuarios/login');
    }
    next(); // segue se estiver logado
}

module.exports = verificaLogin;

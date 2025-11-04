module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();

    // 🔹 Página principal da área do voluntário
    router.get('/area-do-voluntario', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');
        res.render('voluntario/area-do-voluntario');
    });

    return router;
};

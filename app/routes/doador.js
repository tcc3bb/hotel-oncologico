module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();

    // 🔹 Página principal da área do acompanhante
    router.get('/minhas-doacoes', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');
        res.render('doador/minhas-doacoes');
    });

    return router;
};

module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();

    // 🔹 Página principal da área do acompanhante
    router.get('/apoio-ao-paciente', (req, res) => {
        if (!req.session?.user) return res.redirect('/usuarios/login');
        res.render('acompanhante/apoio-ao-paciente');
    });

    return router;
};

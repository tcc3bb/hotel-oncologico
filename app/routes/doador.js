module.exports = (connectionFactory) => {
    const express = require('express');
    const router = express.Router();

    // 🔹 Página principal da área do acompanhante
    router.get('/minhas-doacoes', (req, res) => {
        return res.redirect('/doacoes/minhas');
    });


    return router;
};

const express = require('express');
const router = express.Router();

router.get('/sobre-nos', (req, res) => {
    res.render('nav/sobre-nos', { user: req.session.user || null });
});

router.get('/acomodacoes', (req, res) => {
    res.render('nav/acomodacoes', { user: req.session.user || null });
});

router.get('/sobre-cancer', (req, res) => {
    res.render('nav/sobre-cancer', { user: req.session.user || null });
});

router.get('/apoio-paciente', (req, res) => {
    res.render('nav/apoio-paciente', { user: req.session.user || null });
}); 

router.get('/localizacao', (req, res) => {
    res.render('nav/localizacao', { user: req.session.user || null });
});



module.exports = router;

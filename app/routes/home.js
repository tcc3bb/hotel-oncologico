module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('home/index', { user: req.session.user || null });
    });
};

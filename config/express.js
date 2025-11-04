const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');

module.exports = () => {
  const app = express();

  // Middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(express.static('static'));
  app.use(flash());


  // Sessão precisa vir ANTES de acessar req.session
  app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: false
  }));

  // Agora sim: res.locals.user sempre disponível nas views
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // Views
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'ejs');

  return app;
};

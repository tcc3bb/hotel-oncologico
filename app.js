var express = require('express');
var app = require('./config/express.js')();

// Rotas home
require('./app/routes/home.js')(app);
const flash = require('connect-flash');

// Conexão com banco
const connectionFactory = require('./app/infra/connectionFactory');
const connection = connectionFactory();

// DAO
const UsuariosDAO = require('./app/infra/UsuariosDAO');
const usuariosDAO = new UsuariosDAO(connection);

const PainelAdminDAO = require('./app/infra/PainelAdminDAO')();
const painelAdminDAO = new PainelAdminDAO(connection);

const PerguntasDAO = require('./app/infra/PerguntasDAO');
const perguntasDAO = new PerguntasDAO(connection);

const ArtigosDAO = require('./app/infra/ArtigosDAO');
const artigosDAO = ArtigosDAO(connection);

const ReservasDAO = require('./app/infra/ReservasDAO');
const reservasDAO = new ReservasDAO(connection);

// Rotas 
const usuariosRouter = require('./app/routes/usuarios')(usuariosDAO);
app.use('/usuarios', usuariosRouter);

const passwordsRouter = require('./app/routes/passwords')();
app.use('/', passwordsRouter);

const questionarioRouter = require('./app/routes/questionarios')(connectionFactory);
app.use('/questionarios', questionarioRouter);

const navRouter = require('./app/routes/nav');
app.use('/nav', navRouter);

const adminRouter = require('./app/routes/admin')(painelAdminDAO);
app.use('/admin', adminRouter);

const perguntasRoutes = require('./app/routes/perguntas')(PerguntasDAO, ArtigosDAO);
app.use('/perguntas', perguntasRoutes);

const artigosRouter = require('./app/routes/artigos');
app.use('/artigos', artigosRouter);

const pacienteRouter = require('./app/routes/paciente')(connectionFactory);
app.use('/paciente', pacienteRouter);

const acompanhanteRouter = require('./app/routes/acompanhante')(connectionFactory);
app.use('/acompanhante', acompanhanteRouter);

const voluntarioRouter = require('./app/routes/voluntario')(connectionFactory);
app.use('/voluntario', voluntarioRouter);

const doadorRouter = require('./app/routes/doador')(connectionFactory);
app.use('/doador', doadorRouter);

const doacoesRouter = require('./app/routes/doacoes');
app.use('/doacoes', doacoesRouter);


require('./app/routes/reservas')(app);


// Arquivos estáticos
app.use(express.static('static'));
app.use(express.static('app/public'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


// Servidor Laragon
/*app.listen(3000, function(){
    console.log('Servidor Rodando!');
});*/

// Servidor Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

//mysql -h switchback.proxy.rlwy.net -u root -p aMMHZfHXBatNlkjOObUGbMzyPNEXjFqn --port 51074 --protocol=TCP railway

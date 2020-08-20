const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaUsuarios = require('./routes/users');
const rotaContatos = require('./routes/contatos');
const rotaEmails = require('./routes/emails');
const rotaTelefones = require('./routes/telefones');
const rotaHistoricos = require('./routes/historicos');
const rotaGrupos = require('./routes/grupos');
const rotaTiposAcesso = require('./routes/tipos_acesso');
const rotaTiposEail = require('./routes/tipos_email');
const rotaTiposTelefone = require('./routes/tipos_telefone');

app.use(morgan('dev'));
app.use('uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS');
    return res.status(200).send({

    });
  }
  next();
});

app.use('/usuarios', rotaUsuarios);
app.use('/contatos', rotaContatos);
app.use('/emails', rotaEmails);
app.use('/telefones', rotaTelefones);
app.use('/historicos', rotaHistoricos);
app.use('/grupos', rotaGrupos);
app.use('/tipos-acesso', rotaTiposAcesso);
app.use('/tipos-email', rotaTiposEail);
app.use('/tipos-telefone', rotaTiposTelefone);

app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada.');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;

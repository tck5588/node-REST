const express = require('express');
const app = express();

//DEFINICION DE TODAS LAS RUTAS

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;
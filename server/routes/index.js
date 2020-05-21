const express = require('express');
const app = express();

//DEFINICION DE TODAS LAS RUTAS


app.use(require('./usuario'));
app.use(require('./producto'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;
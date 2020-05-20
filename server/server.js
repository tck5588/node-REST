require('./config/config'); //CONFIGURACIONES

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const path = require('path');

//MIDELWARE
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//CONFIGURACION RUTAS
app.use(require('./routes/index'));


//HABILITAR PUBLIC HTML-PHP
app.use(express.static(path.resolve(__dirname, '../public')));

//CONFIGURACIONES MONGO
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos Online');
});

//ESCUCHA DEL PUERTO
app.listen(process.env.PORT, () => {
    console.log('Escuchando en Puerto:', process.env.PORT);
})
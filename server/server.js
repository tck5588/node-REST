require('./config/config'); //CONFIGURACIONES

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//MIDELWARE
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//OBTENER REGISTROS
app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

//CREAR REGISTROS
app.post('/usuario', function(req, res) {

    let body = req.body;

    // console.log(body.nombre)

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {

        res.json({
            'persona': body
        });

    }


})

//ACTUALIZAR REGISTROS
app.put('/usuario/:id', function(req, res) {

    //obtencion de parametro por peticion HTTP
    let id = req.params.id;


    res.json({
        id
    })

})

//BORRAR REGISTROS
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario')
})

app.listen(3000, () => {
    console.log('Escuchando en Puerto:', process.env.PORT);
})
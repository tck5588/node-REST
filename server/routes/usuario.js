const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

//OBTENER REGISTROS
app.get('/usuario', function(req, res) {
    // res.json('get Usuario LOCAL!')
    //PAGINACION

    let estado = {
        estado: true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(estado, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }


            //OBTENCION DE NUMERO DE REGISTROS    
            Usuario.count(estado, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            });



            // res.json({
            //     ok: true,
            //     usuarios

            // })



        });


})

//CREAR REGISTROS
app.post('/usuario', function(req, res) {

    let body = req.body;

    //CONSTURCCION DEL USUARIO
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //SALVADO EN BASE DE DATOS
    usuario.save((err, usuarioDB) => {

        //Error en la creacion
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // console.log(usuarioDB)

        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



    // console.log(usuario)
    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {

    //     res.json({

    //     });

    // }


})

//ACTUALIZAR REGISTROS
app.put('/usuario/:id', function(req, res) {

    //obtencion de parametro por peticion HTTP
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //BUSQUEDA DE REGISTRO EN DB
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        });

    })

})

//BORRAR REGISTROS
app.delete('/usuario/:id', function(req, res) {
    // res.json('delete Usuario')

    let id = req.params.id; //OBTENCION DEL ID

    let estado = {
        estado: false
    }

    // Usuario.findByIdAndRemove(id, (err, usuario) => {
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        //COMPROBACION USUARIO BORRADO
        if (usuario.estado === 'false') {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }


        //RESPUESTA DE PETICION OK
        res.json({
            ok: true,
            usuario
        })

    })








})

module.exports = app;
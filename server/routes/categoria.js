const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');;


//===============================================================
//VER TODAS LAS CATEGORIA
//===============================================================
app.get('/categoria', verificaToken, function(req, res) {
    //INFORMACION DEL USUARIO VALIDO QUE YA PASO POR EL VERIFICA TOKEN
    // return res.json({
    //     usuario: req.usuario,
    // })

    //PAGINACION Y BUSQUEDA
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }


            //OBTENCION DE NUMERO DE REGISTROS    
            Categoria.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })

            });

        });
});



//===============================================================
//VER CATEGORIA POR ID
//===============================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        //EROR EN LA PETICION
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //SIN RESULTADOS
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La busqueda no dio resultados'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })

    })

});


//===============================================================
//CREA CATEGORIA
//===============================================================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body; //OBTENCION DEL REQUIRE
    //CONSTURCCION DEL USUARIO
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        //RETORNO POR ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //COMPROBACION DE CREACION DE CAT
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //CATEGORIA CREADA
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

//===============================================================
//ACTUALIZA CATEGORIA
//===============================================================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //obtencion de parametro por peticion HTTP
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario']);

    //BUSQUEDA DE REGISTRO EN DB
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //COMPROBACION DE CREACION DE CAT
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    })

});

//===============================================================
//ELIMINAR CATEGORIA
//===============================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //COMPROBACION DE CREACION DE CAT
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    })




});


//EXPORTADOR
module.exports = app;
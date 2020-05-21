const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Producto = require('../models/producto');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');;


//===============================================================
//VER TODOS LAS PRODUCTOS
//===============================================================
app.get('/producto', verificaToken, function(req, res) {
    //INFORMACION DEL USUARIO VALIDO QUE YA PASO POR EL VERIFICA TOKEN
    // return res.json({
    //     usuario: req.usuario,
    // })

    //PAGINACION Y BUSQUEDA
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({}, 'descripcion usuario descripcion')
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }


            //OBTENCION DE NUMERO DE REGISTROS    
            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })

            });

        });
});



//===============================================================
//VER PRODUCTO POR ID
//===============================================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productosDB) => {

            //EROR EN LA PETICION
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //SIN RESULTADOS
            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La busqueda no dio resultados'
                    }
                });
            }

            res.json({
                ok: true,
                productosDB
            })

        }).populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')

});
//===============================================================
//BUSCAR PRODUCTOS
//===============================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex }).exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        })



    })



});



//===============================================================
//CREAR
//===============================================================
app.post('/producto', [verificaToken, verificaAdmin_Role], (req, res) => {


    let body = req.body; //OBTENCION DEL REQUIRE
    //CONSTURCCION DEL USUARIO
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    producto.save((err, productoDB) => {

        //RETORNO POR ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //COMPROBACION DE CREACION DE CAT
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //CATEGORIA CREADA
        res.json({
            ok: true,
            producto: productoDB
        })

    })

});

//===============================================================
//ACTUALIZA PRODUCTO
//===============================================================
app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //obtencion de parametro por peticion HTTP
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'usuario', 'categoria']);

    //BUSQUEDA DE REGISTRO EN DB
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //COMPROBACION DE CREACION DE CAT
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    })

});

//===============================================================
//ELIMINAR PRODUCTO
//===============================================================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id; //OBTENCION DEL ID

    let estado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, estado, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        //COMPROBACION USUARIO BORRADO
        if (productoDB.disponible === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }


        //RESPUESTA DE PETICION OK
        res.json({
            ok: true,
            productoDB
        })

    })


});


//EXPORTADOR
module.exports = app;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();



app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //VERIFICACION DE EXISTENCIA DE UN USUARIO
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //COMPROBACION DE LA CONTRASEÑA    
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }


        //GENERACION DEL TOKEN POR LOGEO EXITOSO
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_SET, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //LOGEO EXISTOSO
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })


})




module.exports = app;
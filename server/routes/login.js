const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

//GOOGLE
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


//CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.img,
        google: true
    }
}
// verify().catch(console.error);


// LOGIN GOOGLE
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;


    let googleUser = await verify(token).catch(err => {
        res.status(403).json({
            ok: false,
            err
        });
    });

    // console.log(googleUser)
    //VERFICACION DE LA EXISTENCIA DEL USUARIO
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            //SI EL USUARIO LOGUEADO NO TIENE CREDENCIALES DE GOOGLE PERMITIDAS POR LA DB
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                //SI EL USUARIO LOGUEADO TIENE PERMITIDA LAS CREDENCIALES DE GOOGLE

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_SET, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            //SI EL USUARIO NO EXITE EN DB SE CREA
            //CONSTURCCION DEL USUARIO
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                password: ':)',
                google: true
            });
            //ESTABLECIMIENTO DE LAS PROPIEDADES PARA LA VALIDACION CON EL SCHEMA


            //GRABACION DB
            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                //CREACION USUARIO OK
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_SET, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });



            })


        }

    });


});


module.exports = app;
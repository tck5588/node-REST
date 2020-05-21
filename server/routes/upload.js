const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//DEFAULT OPTIONS
app.use(fileUpload({ useTempFiles: true }));


//SERVICIO PETICION
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //VALIDACION DE EXISTENCIA DE ARCHIVO
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se a seleccionado ningun archivo'
            }
        })
    }

    //==========================================================================
    //VALIDAR TIPO
    //==========================================================================
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        })
    }

    //CARGA DEL ARCHIVO DESDE EL NOMBRE DEL INPUT
    let archivo = req.files.archivo;

    //VALIDACION DE EXTENCIONES
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //FILTRO DE EXTENCIONES
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extencion invalida'
            }
        })
    }

    //CABIO DE NOMBRE DEL ARCHIVO
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //=======================================================================================
    //VERIFICACION SI EXISTE EL PATH -- SE CREA
    //=======================================================================================
    let pathPrincipal = `uploads/${tipo}/`;

    console.log(pathPrincipal)

    if (!fs.existsSync(pathPrincipal)) {

        //SI NO EXISTE PATH PRINCIPAL
        if (!fs.existsSync(`uploads/`)) {
            //SE CREA
            fs.mkdirSync(`uploads/`);
        }
        //PATH FINAL SE CREA
        fs.mkdirSync(`uploads/${tipo}/`);
    }

    //==================================================================
    //SUBIDA DEL ARCHIVO A LA RUTA 
    //===================================================================
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        //SI EL ARCHIVO DETONA ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }



        //SI EL RESUTADO ES CORRECTO
        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {

            imagenProducto(id, res, nombreArchivo)
        }
    })


});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {



        //ERROR EN PETICION
        if (err) {
            // borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //ERROR DE USUARIO
        if (!usuarioDB) {
            // borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el usuario'
                }
            });
        }

        //VERIFICADOR DE LA EXISTENCIA DE UNA IMAGEN Y BORRADO ANTES DE LA SOBREESCRITURA DE LA VARIABLE
        borraArchivo(usuarioDB.img, 'usuarios');

        //CREACION DEL NOMBRE DE LA IMAGEN
        usuarioDB.img = nombreArchivo;


        usuarioDB.save((err, usuarioGuardado) => {
            //ERROR EN PETICION
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }


            //TODO CORRECTO
            res.json({
                ok: true,
                message: 'Imagen subida correctamente',
                img: nombreArchivo,
                usuario: usuarioGuardado
            })


        })



    })

}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        //ERROR EN PETICION
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //ERROR DE USUARIO
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        }

        console.log(productoDB.img)
            //VERIFICADOR DE LA EXISTENCIA DE UNA IMAGEN
        borraArchivo(productoDB.img, 'productos');


        //CREACION DEL NOMBRE DE LA IMAGEN
        productoDB.img = nombreArchivo;


        productoDB.save((err, usuarioGuardado) => {
            //ERROR EN PETICION
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }


            //TODO CORRECTO
            res.json({
                ok: true,
                message: 'Imagen subida correctamente',
                img: nombreArchivo,
                usuario: usuarioGuardado
            })


        })



    })


}



function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);



    if (fs.existsSync(pathImagen) && nombreImagen) {
        fs.unlinkSync(pathImagen);

    }



}


module.exports = app;
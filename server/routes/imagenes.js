const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/auth')
    // const Usuario = require('../models/usuario');
    // const Producto = require('../models/producto');


let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //PATH DE LA IMAGEN A BUSCAR    
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }








})



module.exports = app;
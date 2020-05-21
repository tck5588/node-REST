//========================================================
//LIBRERIAS
//========================================================
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


//PERSONALIZACION DEL unique
productoSchema.plugin(uniqueValidator, {
    message: '{PATH} del producto debe de ser unico'
});



module.exports = mongoose.model('Producto', productoSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//obtencion del esquema
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesaro']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//MODIFICACION DEL DE IMPRESION JSON DE LA CONTRASEÑA
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;

    return userObjet;
};

//PERSONALIZACION DEL unique
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});



module.exports = mongoose.model('Usuario', usuarioSchema);
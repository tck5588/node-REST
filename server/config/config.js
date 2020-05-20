//CONFIGURACIONES GLOBALES

//====================================
//PUERTO
//====================================

//REASIGNACION DE PUERTO EN CON LA COMPRARACION DE ENTORNO SI ES PRODUCCION O ES DESARROLLO
process.env.PORT = process.env.PORT || 3000;


//====================================
//ENTORNO
//====================================

//REASIGNACION DE PUERTO EN CON LA COMPRARACION DE ENTORNO SI ES PRODUCCION O ES DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================================
//EXPIRACION TOKEN
//====================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//====================================
//SEED DE TOKEN
//====================================
process.env.SEED_SET = process.env.SEED_SET || 'este-es-el-seed-desarrollo';



//====================================
//BASE DA DATOS
//====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_SET;
}

process.env.URLDB = urlDB;

//====================================
//GOOGLE CIENT ID
//====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '869460481764-qi8eb2kaofmaema496eevsd50l8h7emh.apps.googleusercontent.com';
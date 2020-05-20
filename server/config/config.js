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
//BASE DA DATOS
//====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_SET;
}

process.env.URLDB = urlDB;
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
    urlDB = 'mongodb+srv://sggc-5588:W4VzzKFfVgpkOU2J@cluster0-6hjer.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
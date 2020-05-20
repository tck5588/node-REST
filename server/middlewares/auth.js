const jwt = require('jsonwebtoken');


//=======================================
// VERIFICA TOKEN
//=======================================


let verificaToken = (req, res, next) => {

    let token = req.get('token');

    //VERIFICACION DE TOKEN    
    jwt.verify(token, process.env.SEED_SET, (err, decoded) => {

        //ERROR EN EL TOKEN    
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }

        //TOKEN VALIDO
        req.usuario = decoded.usuario;
        next();

    })



    // res.json({
    //     token: token
    // });

}


//=======================================
// VERIFICA ADMIN
//=======================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    //ROL INVALIDO    
    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'Sin privilegios'
            }
        });
    }

    //ROL VALIDO
    next();

}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}
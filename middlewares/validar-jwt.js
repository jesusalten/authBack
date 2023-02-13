const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (request, res = response, next) => {
    const token = request.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })
    }
    try {
        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        request.uid = uid;
        request.name = name
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
    next();
}

module.exports = {
    validarJWT
}
const { response } = require('express');
const { validationResult } = require('express-validator');

const loginUsuario = (request, response = response) => {
    return response.json({
        ok: true,
        msg: 'Login de usuario /'
    })
};

const crearUsuario = (request, response = response) => {
    return response.json({
        ok: true,
        msg: 'Crear usuario /new'
    })
};

const validarUsuario = (request, response = response) => {
    return response.json({
        ok: true,
        msg: 'Validación de usuario /renew'
    })
};

module.exports = {
    loginUsuario,
    crearUsuario,
    validarUsuario
}
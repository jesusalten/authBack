const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const loginUsuario = async(request, res = response) => {
    const {email, password} = request.body;
    try {
        const dbUser = await Usuario.findOne({email: email});
        if ( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            })
        }

        // Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: token
        })
    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

const crearUsuario = async(request, res = response) => {
    const {email, name, password} = request.body;
    try {
        // Verificar email
        const usuario = await Usuario.findOne({ email: email });
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( request.body );

        // Hashear contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // Generar el JWT
        const token = await generarJWT(dbUser.id, name);

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            email: email,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable on el administrador'
        })
    }
};

const validarUsuario = async(request, res = response) => {
    const { uid } = request;

    // Leer la DB
    const dbUser = await Usuario.findById(uid);

    // Generar el JWT
    const token = await generarJWT(uid, dbUser.name);

    return res.json({
        ok: true,
        uid: uid,
        name: dbUser.name,
        email: dbUser.email,
        token: token
    })
};

module.exports = {
    loginUsuario,
    crearUsuario,
    validarUsuario
}
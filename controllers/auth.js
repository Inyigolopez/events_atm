const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        // console.log(usuario)

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            });
        }

        usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el responsable del DataHub'
        });
    }


}


const loginUsuario = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });
        // console.log(usuario)

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún usuario con ese email'
            });
        }

        // Confirmar passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });


    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el responsable del DataHub'
        });

    }


}


const revalidarToken =  async(req, res = response) => {
    
    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
/*
    Rutas de usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');


const router = Router();

router.post(
    '/', 
    [ //middlewares
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email debe tener un formato correcto').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

router.post(
    '/new', 
    [ //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email debe tener un formato correcto').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ], 
    crearUsuario
);

router.get('/renew', validarJWT, revalidarToken);


module.exports = router;
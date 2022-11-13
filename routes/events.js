/*
    Events Routes
    api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, borrarEvento } = require('../controllers/events');

const router = Router();


//Tienen que pasar validación del token JWT
router.use( validarJWT );

// Obtener eventos
router.get('/', getEventos );

// Crear evento
router.post(
    '/',
    [
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        check('start', 'La fecha es obligatoria').custom( isDate ),
        validarCampos
    ], 
    crearEvento 
);

// Actualizar evento
router.put('/:id', actualizarEvento );

// Actualizar evento
router.delete('/:id', borrarEvento );


module.exports = router;
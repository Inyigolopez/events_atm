const { response } = require('express');
const  Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });

}


const crearEvento = async( req, res = response ) => {


    // Verificar que tenga el evento
    const evento = new Evento( req.body );

    try {
        
        evento.user = req.uid;
        evento.start = new Date();

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el responsable del DataHub'
        });
    }


}


const actualizarEvento = async( req, res = response ) => {


    const eventoId = req.params.id;

    try {
        
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;
        
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        }
        
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } ) ;
        res.status(201).json({
            ok: true,
            eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el responsable del DataHub'
        });
    }


}

const borrarEvento = async ( req, res = response ) => {


    const eventoId = req.params.id;

    try {
        
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;
        
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        }
        
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este evento'
            });
        }


        const eventoActualizado = await Evento.findByIdAndDelete( eventoId ) ;
        res.status(201).json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el responsable del DataHub'
        });
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    borrarEvento
}
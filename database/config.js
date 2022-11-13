const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

        await mongoose.connect( process.env.DB_CNN, {
            // userNewUrlParser: true, 
            // useUnifiedTopology: true,
            // useCreatedIndex: true
        });

        console.log('DB Online');

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar la BBDD');
    }

}

module.exports = {
    dbConnection
}
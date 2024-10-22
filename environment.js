require('dotenv').config();

const core ={
    BASE_DATOS: 'mongodb://localhost:27017',
}

const environment = {
    production: true,
    Port: 3000,
    Conexion_Datos: `${core.BASE_DATOS}/notificaciones`
};

module.exports = environment;

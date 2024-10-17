const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/notificaciones')
    .then(() => console.info('Conexión a MongoDB establecida correctamente'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema de notificación
const notificationSchema = new mongoose.Schema({
    group: String,
    sender: String,
    message: String,
    dateTime: String,
    destinatary: String,
    additionalInfo: Object // Puedes agregar más información aquí
});

const Notification = mongoose.model('Notification', notificationSchema);
app.post('/checkMessageExists', async (req, res) => {
    const { message } = req.body;

    // Verificar si se está recibiendo el mensaje correctamente
    console.log("Mensaje recibido:", message);

    if (!message) {
        return res.status(400).json({ error: "No se ha proporcionado ningún mensaje" });
    }

    try {
        // Intentar buscar la existencia del mensaje en la base de datos
        const exists = await Notification.exists({ message: message });

        console.log("Resultado de la consulta:", exists);

        // Enviar respuesta al cliente (true si existe, false si no)
        res.json(exists != null);
    } catch (error) {
        console.error("Error al verificar el mensaje:", error);
        res.status(500).json({ error: 'Error verificando el mensaje' });
    }
});
// Ruta para guardar la notificación
app.post('/saveNotification', (req, res) => {
    const newNotification = new Notification(req.body);
    newNotification.save()
        .then(() => res.status(200).send('Notificación guardada'))
        .catch(err => res.status(500).send('Error al guardar la notificación: ' + err));
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor escuchando en el puerto 3000');
  });
const express = require('express');
const mongoose = require('mongoose');
const environment = require('./environment'); // Asegúrate de que la ruta sea correcta
const app = express();
app.use(express.json());

// Conectar a MongoDB
console.log(`Servidor  ${environment.Conexion_Datos}`);
mongoose.connect(environment.Conexion_Datos)
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
    const { message, sender, dateTime } = req.body;

    // Verificar si se están recibiendo correctamente los datos
    console.log("Datos recibidos - Mensaje:", message, "Remitente:", sender, "Fecha/Hora:", dateTime);

    // Validar si los datos obligatorios están presentes
    if (!message || !sender || !dateTime) {
        return res.status(400).json({ error: "No se han proporcionado todos los campos necesarios: mensaje, remitente, fecha/hora" });
    }

    try {
        // Intentar buscar si existe una entrada con el mismo mensaje, remitente y fecha/hora
        const exists = await Notification.exists({ message: message, sender: sender, dateTime: dateTime });

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
app.listen(environment.Port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${environment.Port}`);
  });
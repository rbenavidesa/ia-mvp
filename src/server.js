import 'dotenv/config';
import routerArticles from './routers/articles.routers.js';
import express from 'express';
import yargs from 'yargs';
import cron from 'node-cron';
import axios from 'axios';
import * as Twilio from './utils/twilio.utils.js';
import dotenv from 'dotenv';

// Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api/articles', routerArticles);

// Middleware a nivel aplicación que revisa las rutas consultadas
app.use((req, res, next) => {
	if (!req.route) {
		return res.status(404).json({ error: '-2, descripción: ruta ' + req.path + ' método ' + req.method + ' no implementada' });
	}
	next();
});

function printServerTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');
	const timeString = `${hours}:${minutes}:${seconds}`;

	console.log(`Current server time: ${timeString}`);
}

// Llamar a la función para imprimir la hora del servidor
printServerTime();

// Tarea programada para ejecutarse todos los días a las 21:30 horas
cron.schedule('29 12 * * *', async () => {
	try {
		const response = await axios.get('http://localhost:8080/api/articles/');
		console.log('Data fetched successfully:', response.data.message);
		Twilio.sendDailyArticle(process.env.ADMIN_WS, response.data.message);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
});

// Server init
const args = yargs(process.argv.slice(2)).argv;
const PORT = args.PORT || 3000;
const server = app.listen(PORT, async () => {
	console.log(`👽 Servidor escuchando en el puerto http://localhost:${PORT}`);
});

server.on('error', (error) => console.log(error));

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getDailyArticle = async (req, res) => {
	try {
		getChatGPTResponse().then((response) => {
			//console.log('Respuesta de ChatGPT:', response);
			res.status(200).json({ message: response });
		});
	} catch (error) {
		console.log(error);
	}
};

function getFormattedDate() {
	const now = new Date();

	// Array con los nombres de los meses en inglés
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// Obtener el nombre del mes actual
	const monthName = months[now.getMonth()];

	// Obtener el día del mes
	const day = now.getDate();

	// Formatear la fecha como "January 2"
	const formattedDate = `${monthName} ${day}`;

	return formattedDate;
}

const API_KEY = process.env.CHATGPT_API_KEY; // Sustituye con tu clave API de OpenAI
const endpoint = process.env.CHATGPT_END_POINT;

async function getChatGPTResponse() {
	try {
		const messages = [
			{
				role: 'system',
				content:
					'You are a helpful assistant, an expert in the Stoic philosophical school, and highly knowledgeable about the book "The Daily Stoic" by Ryan Holiday.',
			},
			{
				role: 'user',
				content:
					'Summarize the section associated with ' +
					getFormattedDate() +
					' from the book "The Daily Stoic" by Ryan Holiday. Use a similar structure as the author.',
			},
		];

		console.log(
			'Summarize the section associated with ' + getFormattedDate() + ' from the book "The Daily Stoic" by Ryan Holiday. Use a similar structure as the author.'
		);

		const response = await axios.post(
			endpoint,
			{
				model: 'gpt-4', // Puedes usar 'gpt-3.5-turbo' u otro modelo que prefieras
				messages: messages,
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response.data.choices[0].message.content;
	} catch (error) {
		console.error('Error al llamar a la API de OpenAI:', error.response ? error.response.data : error.message);
		return null;
	}
}

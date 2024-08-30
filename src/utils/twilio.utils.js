import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.SID, process.env.TOKEN);

export const sendDailyArticle = async (phoneNumber, dailyArticle) => {
	try {
		const message = {
			body: dailyArticle,
			from: 'whatsapp:+14155238886',
			to: 'whatsapp:' + phoneNumber,
		};
		const response = await client.messages.create(message);
	} catch (error) {
		console.log('error', error);
	}
};

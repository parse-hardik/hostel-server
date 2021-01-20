const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const Client_Id = require('./config').GOOGLE_CLIENT_ID;
const Client_Secret = require('./config').GOOGLE_CLIENT_SECRET;
const Refresh_Token = require('./config').REFRESH_TOKEN;
const Redirect_Uri = require('./config').REDIRECT_URI;
const User = require('./config').AUTHORIZED_USER;
const Name = require('./config').NAME;

const oauth2client = new google.auth.OAuth2(Client_Id, Client_Secret, Redirect_Uri);
oauth2client.setCredentials({ refresh_token: Refresh_Token });

async function sendMail(title, emoji, to) {
	try {
		const access_Token = await oauth2client.getAccessToken();
		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: User,
				clientId: Client_Id,
				clientSecret: Client_Secret,
				refreshToken: Refresh_Token,
				accessToken: access_Token,
			}
		})

		const mailOptions = {
			from: `${Name} ${emoji} <${User}>`,
			to: `${to}`,
			subject: `${title}`,
			text: 'Hello',
			html: '<h1> Hello User </h1>'
		}
		const result = await transport.sendMail(mailOptions);
		return result;
	}
	catch (err) {
		console.log(err);
		return err;
	}
}

// sendMail('Test Run', '😉', 'parnamihardik@gmail.com');

exports.sendMail = sendMail;
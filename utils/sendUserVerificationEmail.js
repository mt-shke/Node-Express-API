const sendEmail = require("./sendEmail");

const sendUserVerificationEmail = async ({ email, verificationToken }) => {
	const domain = process.env.domain || "http://localhost:5000";

	const emailTitle = "Verify your account";
	const text = "some text";
	const html = `<p>Please click the following link to activate your account: <a href="${domain}/users/verify-email?token=${verificationToken}&email=${email}">Confirm email</a> </p>`;

	const info = await sendEmail({ email, emailTitle, text, html });

	return info;
};

module.exports = sendUserVerificationEmail;

// const sendEmail = async (req, res) => {
// 	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 	const msg = {
// 		to: "micheltt.dv@gmail.com",
// 		from: "micheltt.dev@gmail.com",
// 		subject: "Sending with SendGrid is Fun",
// 		text: "and easy to do anywhere, even with Node.js",
// 		html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// 	};
// 	sgMail
// 		.send(msg)
// 		.then(() => {
// 			console.log("Email sent");
// 		})
// 		.catch((error) => {
// 			console.error(error);
// 		});

// 	const info = await sgMail.send(msg);
// 	res.json(info);
// };

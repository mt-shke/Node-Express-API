const sendEmail = require("./sendEmail");

const sendUserVerificationEmail = async (req, res) => {
	const domain = process.env.domain || "http://localhost:5000";

	const email = req.body.email;
	const emailTitle = "Verify your account";
	const text = "";
	const html = `<p>Please click the following link to activate your account: <a href="${domain}/users/verify-email?token=${req.body.verificationToken}&email=${email}">Confirm email</a> </p>`;

	sendEmail({ email, emailTitle, text, html });
};

module.exports = sendUserVerificationEmail;

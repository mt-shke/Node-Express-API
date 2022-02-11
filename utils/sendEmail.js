const sendEmail = async (req, res) => {
	const { email, emailTitle, text, html } = req.body;

	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
		to: `${email}`,
		from: "micheltt.dev@gmail.com",
		subject: `${emailTitle}`,
		text: `${text}`,
		html: `${html}`,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});

	const info = await sgMail.send(msg);

	res.status(200).json({ message: "Email sent", info });
};

module.exports = sendEmail;

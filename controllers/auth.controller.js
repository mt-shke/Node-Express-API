const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const UserModel = require("../models/user.model");
const sendUserVerificationEmail = require("../utils/sendUserVerificationEmail");
const crypto = require("crypto");

// Register new account
const register = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please enter a valid email and password");
	}

	const user = UserModel.findOne({ email });
	if (user || user.isVerified === false) {
		throw new CustomError.BadRequestError("This email is already in use");
	}

	const verificationToken = crypto.randomBytes(50).toString("hex");

	const newUser = await UserModel.create({
		email,
		password,
		verificationToken,
	});

	await sendUserVerificationEmail({ email: newUser.email, verificationToken: newUser.verifyEmail });

	console.log(verificationToken);
	res.status(StatusCodes.CREATED).json({ message: "Account created successfully!" });
};

// Verifiy Email account
const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body;
	if (!verificationToken || !email) {
		throw new CustomError.BadRequestError("Token and password invalids");
	}

	const user = await UserModel.findOne({ email });
	if (user.verificationToken !== verificationToken) {
		throw new CustomError.BadRequestError("Token invalid");
	}
	user.verificationToken = "";
	user.isVerified = true;
	user.verified = new Date(Date.now());
	user.save();

	res.status(StatusCodes.OK).json({ message: "Account verified successfully! " });
};

// Login function
const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please enter a valid email and password");
	}

	const user = await UserModel.findOne({ email });
	if (!user) {
		// Email is not in DB
		throw new CustomError.BadRequestError("Please enter a valid email and password");
	}

	const passwordMatch = await user.comparePassword(password);
	if (!passwordMatch) {
		throw new CustomError.BadRequestError("Password invalid");
	}

	// jwt.sign createToken etc
	// create refresh and accessToken
	// attach token to cookie

	res.status(StatusCodes.OK).json({ message: "You are now logged in!" });
};

// Logout function
const logout = async (req, res) => {
	// deleteToken from cookie

	res.status(StatusCodes.OK).json({ message: "You are now logged out!" });
};

module.exports = { register, login, verifyEmail };

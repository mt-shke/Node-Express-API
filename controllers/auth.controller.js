const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const UserModel = require("../models/user.model");
const {
	sendUserVerificationEmail,
	isTokenValid,
	attachCookiesToResponse,
	createToken,
	removeCookies,
} = require("../utils");
const crypto = require("crypto");
const TokenModel = require("../models/token.model");

// Register new account
const register = async (req, res) => {
	const { email, password, role } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please enter a valid email and password");
	}

	const user = await UserModel.findOne({ email });
	if (user) {
		throw new CustomError.BadRequestError("This email is already in use");
	}
	if (user && user.isVerified === false) {
		throw new CustomError.BadRequestError("This email is already in use");
	}

	const isFirstAccount = (await UserModel.countDocuments({})) === 0;

	const verificationToken = crypto.randomBytes(50).toString("hex");
	const newUser = await UserModel.create({
		email,
		password,
		verificationToken,
		role: isFirstAccount ? "admin" : "user",
	});
	await sendUserVerificationEmail({
		email: newUser.email,
		verificationToken: newUser.verificationToken,
	});
	res.status(StatusCodes.CREATED).json({ message: "Account created successfully!", verificationToken });
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
	if (!user.isVerified) {
		// Email exist in DB but user did not verified its account yet
		throw new CustomError.BadRequestError("Please validate your account");
	}

	const passwordMatch = await user.comparePassword(password);
	if (!passwordMatch) {
		throw new CustomError.BadRequestError("Password invalid");
	}

	const tokenUser = createToken(user);

	let refreshToken = "";

	const existingToken = await TokenModel.findOne({ userId: tokenUser.userId });

	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new CustomError.UnauthenticatedError("Token is invalid");
		}

		refreshToken = existingToken.refreshToken;
		attachCookiesToResponse({ res, user, refreshToken });
		res.status(StatusCodes.OK).json({ user: tokenUser });
		return;
	}

	refreshToken = crypto.randomBytes(50).toString("hex");

	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };

	await TokenModel.create(userToken);
	attachCookiesToResponse({ res, user: tokenUser, refreshToken });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Logout function
const logout = async (req, res) => {
	console.log("authC - logout", req.user);
	await TokenModel.findOneAndDelete({ user: req.user.userId });
	removeCookies({ res });
	res.status(StatusCodes.OK).json({ message: "User now logged out!" });
};

module.exports = { register, login, verifyEmail, logout };

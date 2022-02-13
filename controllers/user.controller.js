const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const UserModel = require("../models/user.model");

const getAllUsers = async (req, res) => {
	const users = await UserModel.find({});
	res.status(StatusCodes.OK).json({ message: users });
};

const getSingleUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	if (id !== userId) {
		throw new CustomError.BadRequestError("You are not authorized");
	}
	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.BadRequestError("Invalid request");
	}
	res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	if (id !== userId) {
		throw new CustomError.BadRequestError("You are not authorized");
	}
	// need to create new params to update
	// const { email } = req.body; // params to update
	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.BadRequestError("Invalid request");
	}

	// user.email = email;
	// user.save();
	res.status(StatusCodes.OK).json({ message: "User updated" });
};

const deleteUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	// if (id !== !userId) {
	// 	throw new CustomError.BadRequestError("You are not authorized");
	// }
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please provide email and password");
	}

	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.BadRequestError("Invalid request");
	}

	const passwordMatch = await user.comparePassword(password);
	if (!passwordMatch) {
		throw new CustomError.BadRequestError("Invalid credentials");
	}

	user.remove();
	res.status(StatusCodes.OK).json({ message: "User deleted" });
};

module.exports = { getAllUsers, getSingleUser, updateUser, deleteUser };

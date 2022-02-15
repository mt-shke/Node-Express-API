const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const ProductRequestModel = require("../models/productRequest.model");

const getAllProductRequests = async (req, res) => {
	const requests = await ProductRequestModel.find({});
	res.status(StatusCodes.OK).json({ requests });
};

const createProductRequest = async (req, res) => {
	const { category, title, status, description } = req.body;
	const user = req.user.userId;
	if (!title || !category || !description || !status) {
		throw new CustomError.BadRequestError("A field is missing");
	}
	if (!user) {
		throw new CustomError.UnauthenticatedError("Something wrong happened, please try again later");
	}
	const request = await ProductRequestModel.create({ category, title, status, description, user });

	res.status(StatusCodes.CREATED).json({ success: true, message: "Product request created!", request });
};

const getSingleProductRequest = async (req, res) => {
	const { id: requestId } = req.params;
	const request = await ProductRequestModel.findOne({ _id: requestId });
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}
	res.status(StatusCodes.OK).json({ success: true, request });
};

const updateProductRequest = async (req, res) => {
	const { id: requestId } = req.params;
	const { category, title, status, description } = req.body;
	const request = await ProductRequestModel.findOne({ _id: requestId });
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}
	request.category = category;
	request.title = title;
	request.status = status;
	request.description = description;
	request.save();

	res.status(StatusCodes.OK).json({ succes: true, message: "Updated!" });
};

const deleteProductRequest = async (req, res) => {
	const requestId = req.params.id;
	const userId = req.user.userId;
	const request = await ProductRequestModel.findOne({ _id: requestId });
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}

	const usersMatch = request.user.toString() === userId;
	if (usersMatch || req.user.role === "admin") {
		await request.remove();
		res.status(StatusCodes.OK).json({ success: true, message: "Deleted!" });
		return;
	}
	throw new CustomError.UnauthorizedError("You are not authorized");
};

// Dummy db
const createMultipleDummyRequests = async (req, res) => {
	const admin = req.user.role;
	if (!admin) {
		throw new CustomError.UnauthorizedError("You cannot access this route");
	}

	const requestsPromise = req.body.map(async (request) => {
		return await ProductRequestModel.create({
			category: request.category,
			title: request.title,
			upvotes: request.upvotes,
			status: request.status,
			description: request.description,
			user: req.user.userId,
		});
	});

	const createdRequests = await Promise.all([...requestsPromise]);

	res.status(StatusCodes.CREATED).json({ success: true, message: "Requests Created!", createdRequests });
};

module.exports = {
	getAllProductRequests,
	getSingleProductRequest,
	createProductRequest,
	updateProductRequest,
	deleteProductRequest,
	createMultipleDummyRequests,
};

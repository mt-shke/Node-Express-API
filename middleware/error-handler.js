const { StatusCodes } = require("http-status-codes");

const ErrorHandlerMiddleware = (err, req, res, next) => {
	console.log("ErrMiddleware:", err);
	let customError = {
		statusCodes: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		errorMessage: err.message || "Error handler: something went wrong",
	};

	// Custom code && error

	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = 400;
	}

	res.status(customError.statusCodes).json({ errorMessage: customError.errorMessage });
};

module.exports = ErrorHandlerMiddleware;

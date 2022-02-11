require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Db
const connectDB = require("./db/connectDB");

// Extra package Import
const morgan = require("morgan");
// const helmet = require("helmet");
// const xss = require("xss-clean");
// const cors = require("cors");
// const mongoSanitize = require("mongo-sanitize");
// const rateLimiter = require("express-rate-limit");

// Routes Import
const authRouter = require("./routes/auth.routes");

// Middleware Import
const NotFoundMiddleware = require("./middleware/not-found");
const ErrorHandlerMiddleware = require("./middleware/error-handler");

// app.use

// app.use(
// 	rateLimiter({
// 		windowMs: 15 * 60 * 1000,
// 		max: 60,
// 	})
// );
// app.use(helmet());
// app.use(xss());
// app.use(cors());
// app.use(mongoSanitize());
app.use(express.json());
app.use(morgan("tiny"));

// Routes
app.get("/", (req, res) => {
	res.send("Hello world, welcome home");
});
app.use("/api/v1/auth", authRouter);

// Middleware
app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

// Server start
const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => console.log("Server is listening"));
	} catch (error) {}
};

start();

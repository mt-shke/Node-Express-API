const mongoose = require("mongoose");

const ProductRequestSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provid valid title"],
			minlength: 6,
			maxlength: 60,
		},
		description: {
			type: String,
			required: [true, "Please provid valid title"],
			minlength: 6,
			maxlength: 600,
		},
		category: {
			type: String,
			enum: ["Enhancement", "Feature", "Bug", "UI", "UX"],
			required: [true, "Please provid a category"],
		},
		status: {
			type: String,
			enum: ["Suggestion", "Planned", "In-Progress", "Live"],
			required: [true, "Please provid a status"],
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		upvotes: {
			type: Number,
			default: 0,
		},
		upvoters: {
			type: [mongoose.Types.ObjectId],
			ref: "User",
			required: false,
		},
	},
	{ timestamps: true }
);

ProductRequestSchema.pre("remove", async function (next) {
	await this.model("Comment").deleteMany({ productRequest: this._id }, next);
});

const ProductRequestModel = new mongoose.model("ProductRequest", ProductRequestSchema);

module.exports = ProductRequestModel;

// // Calc when these methods are called
// ReviewSchema.post("save", async function () {
// 	await this.constructor.calculateAverageRating(this.product);
// });

// ReviewSchema.post("remove", async function () {
// 	await this.constructor.calculateAverageRating(this.product);
// });

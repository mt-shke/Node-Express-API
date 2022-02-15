const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: [true, "Please provide context"],
			maxlength: 400,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// each comments has productRequest
		productRequest: {
			type: mongoose.Types.ObjectId,
			ref: "ProductRequest",
			required: true,
		},
		// only comments which repond to another comment has comment field aka parent
		comment: {
			type: mongoose.Types.ObjectId,
			ref: "Comment",
			required: false,
		},
	},
	{ timestamps: true }
);

// ProductRequestSchema.post("remove", async function (next) {
// 	await this.model("Comment").deleteMany({ comments: this._id }, next);
// });

const CommentModel = new mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;

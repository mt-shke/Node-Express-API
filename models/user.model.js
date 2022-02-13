const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Please enter a valid email"],
			validate: {
				validator: validator.isEmail,
				message: "Please enter a valid email",
			},
			unique: [true, "This email is already registered"],
		},
		password: {
			type: String,
			required: [true, "Please enter a valid password"],
			minlength: 6,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
		passwordToken: {
			type: String,
		},
		passwordTokenExpirationDate: {
			type: Date,
		},
		verificationToken: String,
		isVerified: {
			type: Boolean,
			default: false,
		},
		verified: Date,
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function () {
	if (!this.isModified("password")) {
		return;
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;

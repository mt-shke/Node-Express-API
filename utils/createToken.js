const createToken = (user) => {
	return { email: user.email, userId: user._id, role: user.role };
};

module.exports = createToken;

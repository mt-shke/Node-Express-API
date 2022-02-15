const createToken = (user) => {
	return {
		email: user.email,
		fullname: user.fullname,
		username: user.username,
		userId: user._id,
		role: user.role,
	};
};

module.exports = createToken;

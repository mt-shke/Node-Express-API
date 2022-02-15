const router = require("express").Router();
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");
const {
	getAllProductRequests,
	getSingleProductRequest,
	createProductRequest,
	updateProductRequest,
	deleteProductRequest,
	createMultipleDummyRequests,
} = require("../controllers/productRequest.controller");
const {
	postComment,
	createMultipleDummyComments,
	deleteComment,
	updateComment,
	createMultipleReplies,
} = require("../controllers/comment.controller");

router
	.route("/")
	.get(getAllProductRequests)
	.post([authenticateUser, authorizePermissions("user")], createProductRequest);

// Original Dummy FE data
router
	.route("/create-multiple-requests")
	.post([authenticateUser, authorizePermissions("admin")], createMultipleDummyRequests);
router
	.route("/create-multiple-comments")
	.post([authenticateUser, authorizePermissions("admin")], createMultipleDummyComments);
router
	.route("/create-multiple-replies")
	.post([authenticateUser, authorizePermissions("admin")], createMultipleReplies);

router
	.route("/:productRequestId")
	.get(getSingleProductRequest)
	.patch([authenticateUser, authorizePermissions("user")], updateProductRequest)
	.delete([authenticateUser, authorizePermissions("user")], deleteProductRequest);

router
	.route("/:productRequestId/reply")
	.post([authenticateUser, authorizePermissions("user", "admin")], postComment);

router
	.route("/:productRequestId/:commentId")
	.patch([authenticateUser, authorizePermissions("user", "admin")], updateComment)
	.delete([authenticateUser, authorizePermissions("user", "admin")], deleteComment);

router
	.route("/:productRequestId/:commentId/reply")
	.post([authenticateUser, authorizePermissions("user", "admin")], postComment);

module.exports = router;

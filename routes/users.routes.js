const router = require("express").Router();
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");
const { getAllUsers, getSingleUser, updateUser, deleteUser } = require("../controllers/user.controller");

router.route("/").get([authenticateUser, authorizePermissions("admin")], getAllUsers);
router
	.route("/:id")
	.get([authenticateUser, authorizePermissions("admin", "user")], getSingleUser)
	.patch([authenticateUser, authorizePermissions("admin", "user")], updateUser)
	.delete([authenticateUser, authorizePermissions("admin", "user")], deleteUser);

module.exports = router;

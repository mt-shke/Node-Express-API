const router = require("express").Router();
const { register, login, verifyEmail, logout } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/authentication");

router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(authenticateUser, logout);

module.exports = router;

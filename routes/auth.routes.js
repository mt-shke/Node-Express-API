const router = require("express").Router();
const { register, login, verifyEmail } = require("../controllers/auth.controller");

router.route("/register").post(register);
router.route("/verifyEmail").post(verifyEmail);
router.route("/login").post(login);

module.exports = router;

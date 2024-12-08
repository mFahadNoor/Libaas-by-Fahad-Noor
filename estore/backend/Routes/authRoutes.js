const express = require("express");
const { register, login, forgotPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgetpassword", forgotPassword);

module.exports = router;

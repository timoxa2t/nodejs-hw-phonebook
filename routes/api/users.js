const express = require("express");
const ctrlTask = require('../../controllers/users');

const router = express.Router();

router.get("/login", ctrlTask.loginUser)

router.post("/register", ctrlTask.registerUser)

router.get("/verify/:verificationToken", ctrlTask.verifyEmail)

router.post("/verify", ctrlTask.resendVerificationEmail)

module.exports = router;

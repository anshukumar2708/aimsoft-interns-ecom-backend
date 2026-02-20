const express = require("express");
const { registration, login, sendEmailOtp, verifyEmail, sendMobileOtp, verifyMobile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const Router = express.Router();

Router.post("/registration", registration);
Router.post("/login", login);

// Email send otp and verify
Router.post("/send-email-otp", authMiddleware, sendEmailOtp);
Router.post("/email-verify", authMiddleware, verifyEmail);


// Mobile send otp and verify
Router.post("/send-mobile-otp", authMiddleware, sendMobileOtp);
Router.post("/mobile-verify", authMiddleware, verifyMobile);



module.exports = Router;
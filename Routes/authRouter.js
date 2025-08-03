const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.get("/login", authController.getLogin);
authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogOut);
authRouter.get("/verify-otp", authController.getVerifyOTP); // OTP ইনপুট ফর্ম দেখানোর জন্য
authRouter.post("/verify-otp", authController.postVerifyOTP); // OTP সাবমিট ও ভেরিফিকেশন হ্যান্ডেল করার জন্য



module.exports = authRouter;

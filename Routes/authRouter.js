const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.get("/login", authController.getLogin);
authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogOut);
authRouter.get("/verify-otp", authController.getVerifyOTP); 
authRouter.post("/verify-otp", authController.postVerifyOTP); 



module.exports = authRouter;

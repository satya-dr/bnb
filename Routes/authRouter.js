const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogOut);
authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignup);



module.exports = authRouter;

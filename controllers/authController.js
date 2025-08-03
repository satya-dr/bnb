const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendOTPEmail = require("../utils/sendEmail"); // nodemailer OTP ইমেইল পাঠানোর ফাংশন

// GET /login
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentUrl: req.originalUrl,
    isLoggedIn: req.session.isLoggedIn || false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

// GET /signup
exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    currentUrl: req.originalUrl,
    isLoggedIn: req.session.isLoggedIn || false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
    user: {},
  });
};

// POST /signup
exports.postSignup = [
  // Validation rules
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be contain at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name should only contain alphabets"),

  check("lastName")
    .optional({ checkFalsy: true })
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name can only contain letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid Email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should contain at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  // Controller logic
  async (req, res, next) => {
    const { firstName, email, lastName, password, userType } = req.body;
    const errors = validationResult(req);

    // Validation error থাকলে রেন্ডার করুন
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        currentUrl: req.originalUrl,
        isLoggedIn: req.session.isLoggedIn || false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, userType },
        user: {},
      });
    }

    try {
      // Duplicate email check
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).render("auth/signup", {
          pageTitle: "Sign Up",
          currentUrl: req.originalUrl,
          isLoggedIn: req.session.isLoggedIn || false,
          errors: ["Email already exists. Please login or use a different email."],
          oldInput: { firstName, lastName, email, userType },
          user: {},
        });
      }

      // Password hash
      const hashedPassword = await bcrypt.hash(password, 12);

      // নতুন ইউজার তৈরি, isVerified false নিয়ে
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
        isVerified: false,
      });

      await user.save();

      // OTP Generate (6 digit)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Session এ OTP, expiry, emailToVerify রাখুন
      req.session.otp = otp;
      req.session.otpExpires = Date.now() + 10 * 60 * 1000; // ১০ মিনিট সময়সীমা
      req.session.emailToVerify = email;

      // OTP ইমেইল পাঠান
      await sendOTPEmail(email, otp);

      // OTP ভেরিফিকেশন পেজে রিডাইরেক্ট
      return res.redirect("/verify-otp");
    } catch (err) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        currentUrl: req.originalUrl,
        isLoggedIn: req.session.isLoggedIn || false,
        errors: [err.message],
        oldInput: { firstName, lastName, email, userType },
        user: {},
      });
    }
  },
];

// POST /login
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Log In",
        currentUrl: req.originalUrl,
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: { email },
        user: {},
      });
    }

    // Check verified or not
    if (!user.isVerified) {
      return res.status(422).render("auth/login", {
        pageTitle: "Log In",
        currentUrl: req.originalUrl,
        isLoggedIn: false,
        errors: ["Please verify your email address first (OTP pending)"],
        oldInput: { email },
        user: {},
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).render("auth/login", {
        pageTitle: "Log In",
        currentUrl: req.originalUrl,
        isLoggedIn: false,
        errors: ["Invalid password"],
        oldInput: { email },
        user: {},
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

// POST /logout
exports.postLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

// GET /verify-otp
exports.getVerifyOTP = (req, res, next) => {
  res.render("auth/verify-otp", {
    pageTitle: "Verify OTP",
    errors: [],
     currentUrl: req.originalUrl || "/verify-otp",  // এই লাইনটি যোগ করতে হবে
    isLoggedIn: req.session.isLoggedIn || false   // প্রয়োজনমতো যুক্ত করুন
  });
};

// POST /verify-otp
exports.postVerifyOTP = async (req, res, next) => {
  const { otp } = req.body;

  const sessionOTP = req.session.otp;
  const otpExpires = req.session.otpExpires;
  const emailToVerify = req.session.emailToVerify;

  if (!sessionOTP || !otpExpires || !emailToVerify) {
    return res.redirect("/signup");
  }

  if (Date.now() > otpExpires) {
    req.session.otp = null;
    req.session.otpExpires = null;
    req.session.emailToVerify = null;

    return res.status(422).render("auth/verify-otp", {
      pageTitle: "Verify OTP",
      errors: ["OTP expired. Please sign up again."],
       currentUrl: req.originalUrl || "/verify-otp",  // এখানে দিন
      isLoggedIn: req.session.isLoggedIn || false
    });
  }

  if (otp === sessionOTP) {
    try {
      await User.findOneAndUpdate(
        { email: emailToVerify },
        { isVerified: true }
      );

      req.session.otp = null;
      req.session.otpExpires = null;
      req.session.emailToVerify = null;

      return res.redirect("/login");
    } catch (err) {
      return res.status(500).render("auth/verify-otp", {
        pageTitle: "Verify OTP",
        errors: [err.message],
        currentUrl: req.originalUrl || "/verify-otp",
      isLoggedIn: req.session.isLoggedIn || false
      });
    }
  } else {
    return res.status(422).render("auth/verify-otp", {
      pageTitle: "Verify OTP",
      errors: ["Invalid OTP"],
      currentUrl: req.originalUrl || "/verify-otp",
      isLoggedIn: req.session.isLoggedIn || false
    });
  }
};

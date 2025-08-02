const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt=require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentUrl: req.originalUrl,
    isLoggedIn: false,
    errors: [], 
     oldInput: { email: ""},
       user: {}
  });
};
exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    currentUrl: req.originalUrl,
    isLoggedIn: req.session.isLoggedIn || false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
       user: {}
  });
};

// exports.postLogin = (req, res, next) => {
//   console.log(req.body);
//   req.session.isLoggedIn = true;
//   res.redirect('/');
// };
exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be contain atleast 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name should only alphabets"),

  check("lastName")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name only contain letters"),

  check("email")
    .isEmail()
    .withMessage("Please Enter a valid Email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be cointain alteast 8 character long")
    .matches(/[A-Z]/)
    .withMessage("Password should be cointain alteast one uppercase")
    .matches(/[a-z]/)
    .withMessage("Password should be cointain alteast one lowercase")
    .matches(/[0-9]/)
    .withMessage("Password should be cointain alteast one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password should be cointain alteast one special character")
    .trim(),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password don't match");
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

  (req, res, next) => {
    const { firstName, email, lastName, password, userType } = req.body;
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        currentUrl: req.originalUrl,
        isLoggedIn: req.session.isLoggedIn || false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
       user: {}
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Sign Up",
          currentUrl: req.originalUrl,
          isLoggedIn: req.session.isLoggedIn || false,
          errors: [err.message],
          oldInput: { firstName, lastName, email, password, userType },
       user: {}
        });
      });
  },
];

exports.postLogin = async (req, res, next) => {
  const {email,password}=req.body;
  const user= await User.findOne({email});
  if(!user){
    return res.status(422).render("auth/login", {
          pageTitle: "Log In",
          currentUrl: req.originalUrl,
          isLoggedIn:false,
          errors: ["User does not exist"],
          oldInput: {email},
       user: {}
        });
  }

const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
  return res.status(422).render("auth/login", {
          pageTitle: "Log In",
          currentUrl: req.originalUrl,
          isLoggedIn:false,
          errors: ["Invalid password"],
          oldInput: {email},
       user: {}
        });

}
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  // res.cookie("isLoggedIn",true);
  // req.isLoggedIn=true;
  res.redirect("/");
};
exports.postLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

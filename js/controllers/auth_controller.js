const UserModel = require("../models/user_model");
const UserValidation = require("../validations/user_validation");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors_utils");
const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

const db = require("../../config/db");
const User = db.user;
const Posts = db.post;

// ===================================================
// createToken
// ===================================================
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

// ===================================================
// signUp
// ===================================================
module.exports.signUp = async (req, res) => {
  const { body } = req;
  const { error } = UserValidation(body);

  if (error) return res.status(401).json(error.details[0].message);

  UserModel.create({ ...body })
    .then((user) => {
      res.status(201).json({ message: `User added : ${user.id}` });
    })
    .catch((error) => {
      const errors = signUpErrors(error);
      res.status(200).json({ errors });
    });

  // Create modo if any
};

// ===================================================
// login
// ===================================================
module.exports.login = async (req, res) => {
  console.log("login call");
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
      secure: true, // Needed for Heroku.com CORS Policy
      sameSite: "none", // Needed for Heroku.com CORS Policy
    });
    res.status(200).json({ user: user.id });
  } catch (error) {
    console.log("login error", error);
    const errors = signInErrors(error);
    res.status(200).json({ errors });
  }
};

// ===================================================
// logout
// ===================================================
module.exports.logout = async (req, res) => {
  console.log("logout");
  console.log(req.body);
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
    secure: true, // Needed for Heroku.com CORS Policy
    sameSite: "none", // Needed for Heroku.com CORS Policy
  });
  console.log("Cookie: ", res.cookie);
  //res.redirect("/");
};

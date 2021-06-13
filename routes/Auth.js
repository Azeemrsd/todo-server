const express = require("express");
const { sendResponse } = require("../utils/response");
const router = express.Router();
const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// @desc /auth/login
// @route POST
// @result auth token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username: username });
    if (user) {
      //if user is found comparing the password
      const isPasswordMatched = await bcrypt.compare(
        password,
        user._doc.password
      );
      if (isPasswordMatched) {
        // if password is correct then generating token and sending response
        const token = await jwt.sign(
          { user: user._doc },
          process.env.JWT_SECRET_KEY
        );
        sendResponse(
          res,
          true,
          200,
          "Login successful",
          "You successfully logged in.",
          token
        );
      } else {
        // sending error because password does not match
        sendResponse(
          res,
          false,
          401,
          "Login Failed",
          "Incorrect password for login."
        );
      }
    } else {
      //sending error username does not exist
      sendResponse(res, false, 400, "Login Failed", "Username does not exist.");
    }
  } catch (error) {
    sendResponse(res, false, 400, "Login Failed", error.message);
  }
  //finding user by username
});

// @desc /register
// @route POST
// @result upon success redirects to login
router.post("/register", async (req, res) => {
  const { username, email, firstName, lastName, passwordOne } = req.body;
  try {
    const isUserAlreadyExist = await Users.findOne({ username: username });
    if (isUserAlreadyExist) {
      sendResponse(res, false, 400, "SignUp Failed", "User Already Exist!");
    } else {
      //if user is not exist then hashing the password
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(passwordOne, salt);
      const newUser = {
        username,
        email,
        firstName,
        lastName,
        password: hash,
      };
      // creating new user using hashed password
      const user = await Users.create(newUser);
      if (user) {
        sendResponse(
          res,
          true,
          200,
          "SignUp success",
          "SignUp is successful please login"
        );
      } else {
        sendResponse(
          res,
          false,
          400,
          "SignUp failed",
          "Internal server error."
        );
      }
    }
  } catch (error) {
    sendResponse(res, false, 400, "SignUp failed", error.message);
  }
});

module.exports = router;

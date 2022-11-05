const express = require("express");
const userRouter = express.Router();
const User = require("../models/userModel");
const { createUser } = require("../controllers/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// signup route
userRouter.post("/api/signup", createUser);

// login route
userRouter.post("/api/login", async (req, res, next) => {
  try {
    // get the email and password from the request body
    const { email, password } = req.body;
    // check database for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "email or password is incorrect",
      });
    }
    const passwordIsValid = await user.isValidPassword(password);

    if (!passwordIsValid) {
      return res.status(401).json({
        status: false,
        message: "email or password is incorrect",
      });
    }

    const body = {
      username: user.email,
      id: user._id,
    };

    const validityPeriod = "1h";

    const token = jwt.sign(body, JWT_SECRET, {
      expiresIn: validityPeriod,
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;

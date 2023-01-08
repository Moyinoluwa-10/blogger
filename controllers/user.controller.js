const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const createUser = async (req, res, next) => {
  try {
    const body = req.body;
    const { email, username } = body;

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: false,
        message: "User with this email already exists",
      });
    }

    const user2 = await User.findOne({ username });
    if (user2) {
      return res.status(400).json({
        status: false,
        message: "User with this username already exists",
      });
    }

    const createdUser = await User.create(body);

    return res.status(201).json({
      status: true,
      message: "Signup successful",
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
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
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const validityPeriod = "1h";

    const token = jwt.sign(body, JWT_SECRET, {
      expiresIn: validityPeriod,
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
};

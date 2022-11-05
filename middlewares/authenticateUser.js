const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("./errorHandler");

const authenticateUser = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(403).json({
        status: false,
        message: "No token provided",
      });
    }

    // get the token from the authorization header
    req.token = authorization.split(" ")[1];

    // getting user details from token
    const userDetailsFromToken = jwt.verify(req.token, process.env.JWT_SECRET);

    const user = await User.findById(userDetailsFromToken.id);

    // add user to request object
    req.user = user;
    next();
  } catch (err) {
    err.source = "jwt middleware error";
    next(err);
  }
};

module.exports = {
  authenticateUser,
};

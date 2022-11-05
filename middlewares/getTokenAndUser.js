const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getTokenandUser = async (req, res, next) => {
  try {
    const authorization = req.get("authorization");

    if (!(authorization && authorization.toLowerCase().startsWith("bearer"))) {
      throw new Error();
    }

    // get the token from the authorization header
    req.token = authorization.split(" ")[1];
    console.log(req.token);

    // getting user details from token
    const userDetailsFromToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const user = await User.findById(userDetailsFromToken.id);
    if (!user) {
      throw new Error();
    }

    // add user to request object
    req.user = user;
    next();
  } catch (err) {
    err.source = "jwt middleware error";
    next(err);
  }
};

module.exports = {
  getTokenandUser,
};

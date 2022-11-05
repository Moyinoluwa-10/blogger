const User = require("../models/userModel");

const createUser = async (req, res, next) => {
  try {
    // get the details from the request body
    const { first_name, last_name, username, email, password, country } =
      req.body;
    // create a new user with those details
    const newUser = new User({
      first_name,
      last_name,
      username,
      email,
      password,
      country,
    });
    // save the new user to the database
    const createdUser = await newUser.save();

    return res.status(201).json({
      status: true,
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
};

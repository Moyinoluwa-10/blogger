const express = require("express");
const authRouter = express.Router();
const { createUser, loginUser } = require("../controllers/auth.controller");
const { addUserValidationMW } = require("../validators/user.validator");

// signup route
authRouter.post("/signup", addUserValidationMW, createUser);

// login route
authRouter.post("/login", loginUser);

module.exports = authRouter;

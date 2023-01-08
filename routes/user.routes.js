const express = require("express");
const userRouter = express.Router();
const { createUser, loginUser } = require("../controllers/user.controller");
const { addUserValidationMW } = require("../validators/user.validator");

// signup route
userRouter.post("/signup", addUserValidationMW, createUser);

// login route
userRouter.post("/login", loginUser);

module.exports = userRouter;

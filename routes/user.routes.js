const express = require("express");
const userRouter = express.Router();
const { createUser, loginUser } = require("../controllers/user.controller");

// signup route
userRouter.post("/api/signup", createUser);

// login route
userRouter.post("/api/login", loginUser);

module.exports = userRouter;

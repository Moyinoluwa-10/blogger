const express = require("express");
const userRouter = express.Router();
const { createUser, loginUser } = require("../controllers/user");

// signup route
userRouter.post("/api/signup", createUser);

// login route
userRouter.post("/api/login", loginUser);

module.exports = userRouter;

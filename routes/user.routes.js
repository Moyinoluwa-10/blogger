const express = require("express");
const userRouter = express.Router();
const { getUser, getAllUsers } = require("../controllers/user.controller");

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

module.exports = userRouter;

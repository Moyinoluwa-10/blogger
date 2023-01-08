const express = require("express");
const blogRouter = express.Router();
const {
  createBlog,
  getAllPublishedBlogs,
  getPublishedBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  getAListOfUserBlogs,
} = require("../controllers/blog.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");

// requests that don't require authentication
blogRouter.get("/", getAllPublishedBlogs);
blogRouter.get("/:id", getPublishedBlog);

// requests that require authentication
blogRouter.get("/user/:id", authenticateUser, getAListOfUserBlogs);
blogRouter.post("/", authenticateUser, createBlog);
blogRouter.patch("/state/:id", authenticateUser, publishBlog);
blogRouter.patch("/:id", authenticateUser, updateBlog);
blogRouter.delete("/:id", authenticateUser, deleteBlog);

module.exports = blogRouter;

const express = require("express");
const blogRouter = express.Router();
const {
  getAllPublishedBlogs,
  getPublishedBlog,
  getAListOfUserBlogs,
  createBlog,
  deleteBlog,
} = require("../controllers/blog.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");
const {
  addBlogValidationMW,
  updateBlogValidationMW,
} = require("../validators/blog.validator");

// requests that don't require authentication
blogRouter.get("/", getAllPublishedBlogs);
blogRouter.get("/:id", getPublishedBlog);

// requests that require authentication
blogRouter.get("/user/:id", authenticateUser, getAListOfUserBlogs);
blogRouter.post("/", authenticateUser, addBlogValidationMW, createBlog);
blogRouter.delete("/:id", authenticateUser, deleteBlog);

module.exports = blogRouter;

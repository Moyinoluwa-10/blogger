const express = require("express");
const blogRouter = express.Router();
const {
  createBlog,
  getAllPublishedBlogs,
  getPublishedBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  getUserBlogs,
} = require("../controllers/blog");
const { getTokenandUser } = require("../middlewares/getTokenAndUser");

// requests that don't require authentication
blogRouter.get("/", getAllPublishedBlogs);
blogRouter.get("/:id", getPublishedBlog);
blogRouter.get("/users/:id", getUserBlogs);

// requests that require authentication
blogRouter.use(getTokenandUser);
blogRouter.post("/", createBlog);
blogRouter.patch("/state/:id", publishBlog);
blogRouter.patch("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;

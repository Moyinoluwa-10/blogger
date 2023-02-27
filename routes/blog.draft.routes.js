const express = require("express");
const blogRouter = express.Router();
const {
  getDraftBlog,
  updateDraftBlog,
  publishDraftBlog,
  deleteDraftBlog,
} = require("../controllers/blog.draft.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { updateBlogValidationMW } = require("../validators/blog.validator");

blogRouter.get("/:id", authenticateUser, getDraftBlog);
blogRouter.patch(
  "/:id",
  authenticateUser,
  updateBlogValidationMW,
  updateDraftBlog
);
blogRouter.patch("/publish/:id", authenticateUser, publishDraftBlog);
blogRouter.delete("/:id", authenticateUser, deleteDraftBlog);

module.exports = blogRouter;

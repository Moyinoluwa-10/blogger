const Blog = require("../models/blog.model");
const { readingTime } = require("../utils/readingTime");

// get a draft blog
const getDraftBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("authorID", { username: 1 });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

    if (req.user.id !== blog.authorID[0].id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to get this blog",
      });
    }

    if (blog.state !== "draft") {
      return res.status(403).json({
        status: false,
        message: "Requested blog is not published",
      });
    }

    return res.json({
      status: true,
      blog: blog,
    });
  } catch (err) {
    err.source = "get draft blog controller";
    next(err);
  }
};

// update a draft blog
const updateDraftBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update = req.body;

    const blog = await Blog.findById(id).populate("authorID", { username: 1 });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

    if (req.user.id !== blog.authorID[0].id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to update this draft blog",
      });
    }

    if (blog.state !== "draft") {
      return res.status(403).json({
        status: false,
        message: "Requested blog has been published",
      });
    }

    let body = req.body.body;
    if (body) {
      update.reading_time = readingTime(body);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("authorID", { username: 1 });

    return res.status(200).json({
      status: true,
      message: "Draft blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    err.source = "Update draft blog controller";
    next(err);
  }
};

// publish a blog
const publishDraftBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("authorID", { username: 1 });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

    if (req.user.id !== blog.authorID[0].id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to publish this blog",
      });
    }

    if (blog.state === "published") {
      return res.status(403).json({
        status: false,
        message: "This blog has been published",
      });
    }

    blog.state = "published";
    await blog.save();

    return res.json({
      status: true,
      message: "Blog published successfully",
      blog: blog,
    });
  } catch (err) {
    err.source = "Publish draft blog controller";
    next(err);
  }
};

// delete a draft blog
const deleteDraftBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("authorID", {
      username: 1,
    });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

    if (req.user.id !== blog.authorID[0].id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to delete this blog",
      });
    }

    if (blog.state !== "draft") {
      return res.status(403).json({
        status: false,
        message: "Requested blog has been published",
      });
    }

    await blog.remove();

    return res.status(200).json({
      status: true,
      message: "Draft blog deleted successfully",
    });
  } catch (err) {
    err.source = "Delete draft blog controller";
    next(err);
  }
};

module.exports = {
  getDraftBlog,
  updateDraftBlog,
  publishDraftBlog,
  deleteDraftBlog,
};

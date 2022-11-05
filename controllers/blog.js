const Blog = require("../models/blogModel");
const { readingTime } = require("../middlewares/readingTime");

// get all published blogs
const getAllPublishedBlogs = async (req, res, next) => {
  try {
    const { page, author, title, tags } = req.query;
    const query1 = author ? { author } : {};
    const query2 = title ? { title } : {};
    const query3 = tags ? { tags } : {};
    const blogs = await Blog.find({ state: "published" })
      .find(query1)
      .find(query2)
      .find(query3)
      .populate("author", { username: 1 })
      .skip(page > 0 ? page * 20 : 0)
      .limit(20);

    return res.json({
      status: true,
      data: blogs,
    });
  } catch (err) {
    err.source = "get all published blogs controller";
    next(err);
  }
};

// get a published blog
const getPublishedBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", { username: 1 });

    if (blog.state !== "published") {
      return res.status(403).json({
        status: false,
        message: "Requested blog is not published",
      });
    }

    // update blog read count
    blog.read_count += 1;
    await blog.save();

    return res.json({
      status: true,
      data: blog,
    });
  } catch (err) {
    err.source = "get a published blog controller";
    next(err);
  }
};

// create a blog
const createBlog = async (req, res, next) => {
  try {
    // get the details from the request body
    const { title, description, tags, body } = req.body;
    // create a new blog
    const newBlog = new Blog({
      title,
      description,
      tags,
      author: req.user._id,
      body,
      reading_time: readingTime(body),
    });
    // save to new blog to the database
    const createdBlog = await newBlog.save();
    return res.status(201).json({
      status: true,
      data: createdBlog,
    });
  } catch (error) {
    next(error);
  }
};

// get all blogs for a particular user
const getUserBlogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, state } = req.query;
    const query = state ? { state } : {};
    const blogs = await Blog.find({ author: id })
      .find(query)
      .populate("author", { username: 1 })
      .skip(page > 0 ? page * 10 : 0)
      .limit(10);

    return res.json({
      status: true,
      data: blogs,
    });
  } catch (err) {
    err.source = "get published blogs controller";
    next(err);
  }
};

// update a blog
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const blog = await Blog.findById(id).populate("author", { username: 1 });

    if (req.user.username !== blog.author.username) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this blog",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true });

    return res.status(200).json({
      status: true,
      data: updatedBlog,
    });
  } catch (err) {
    err.source = "Update blog controller";
    next(err);
  }
};

// publish a blog
const publishBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", { username: 1 });

    if (req.user.username !== blog.author.username) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to publish this blog",
      });
    }

    if (blog.state === "published") {
      return res.status(403).json({
        status: false,
        message: "The blog has been published",
      });
    }

    blog.state = "published";
    await blog.save();

    return res.json({
      status: true,
      data: blog,
    });
  } catch (err) {
    err.source = "Published blog controller";
    next(err);
  }
};

// delete a blog
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", {
      username: 1,
    });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    if (req.user.username !== blog.author.username) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete this blog",
      });
    }

    await blog.remove();

    return res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    err.source = "Delete blog controller";
    next(err);
  }
};

module.exports = {
  getAllPublishedBlogs,
  getPublishedBlog,
  createBlog,
  getUserBlogs,
  updateBlog,
  publishBlog,
  deleteBlog,
};

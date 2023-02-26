const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const { readingTime } = require("../utils/readingTime");

// get all published blogs
const getAllPublishedBlogs = async (req, res, next) => {
  try {
    let blogs;
    const { page, author, title, tags, sortBy, order } = req.query;
    const tag = tags ? tags : "";
    const titles = title ? title : "";
    const authors = author ? author : "";
    const orders = order === "asc" ? 1 : -1;
    if (sortBy === "read_count") {
      blogs = await Blog.find({ state: "published" })
        .find({ author: { $regex: `${authors}`, $options: "i" } })
        .find({ title: { $regex: `${titles}`, $options: "i" } })
        .find({ tags: { $regex: `${tag}`, $options: "i" } })
        .sort({ read_count: `${orders}` })
        .select({ title: 1 })
        .populate("authorID", { username: 1 })
        .skip(page > 0 ? page * 20 : 0)
        .limit(20);
    } else if (sortBy === "reading_time") {
      blogs = await Blog.find({ state: "published" })
        .find({ author: { $regex: `${authors}`, $options: "i" } })
        .find({ title: { $regex: `${titles}`, $options: "i" } })
        .find({ tags: { $regex: `${tag}`, $options: "i" } })
        .sort({ reading_time: `${orders}` })
        .select({ title: 1 })
        .populate("authorID", { username: 1 })
        .skip(page > 0 ? page * 20 : 0)
        .limit(20);
    } else if (sortBy === "createdAt") {
      blogs = await Blog.find({ state: "published" })
        .find({ author: { $regex: `${authors}`, $options: "i" } })
        .find({ title: { $regex: `${titles}`, $options: "i" } })
        .find({ tags: { $regex: `${tag}`, $options: "i" } })
        .sort({ createdAt: `${orders}` })
        .select({ title: 1 })
        .populate("authorID", { username: 1 })
        .skip(page > 0 ? page * 20 : 0)
        .limit(20);
    } else {
      blogs = await Blog.find({ state: "published" })
        .find({ author: { $regex: `${authors}`, $options: "i" } })
        .find({ title: { $regex: `${titles}`, $options: "i" } })
        .find({ tags: { $regex: `${tag}`, $options: "i" } })
        .select({ title: 1 })
        .populate("authorID", { username: 1 })
        .skip(page > 0 ? page * 20 : 0)
        .limit(20);
    }

    return res.json({
      status: true,
      blogs: blogs,
    });
  } catch (err) {
    err.source = "get all published blogs";
    next(err);
  }
};

// get a published blog
const getPublishedBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("authorID", { username: 1 });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

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
      blog: blog,
    });
  } catch (err) {
    next(err);
  }
};

// create a blog
const createBlog = async (req, res, next) => {
  try {
    // check if title has been used
    const { title, body } = req.body;
    const blog = await Blog.findOne({ title });
    if (blog) {
      return res.status(400).json({
        status: false,
        message: "Blog with this title already exists",
      });
    }

    // create a new blog
    const createdBlog = await Blog.create({
      ...req.body,
      authorID: req.user._id,
      reading_time: readingTime(body),
      author: `${req.user.first_name} ${req.user.last_name}`,
    });

    const user = await User.findOne({ _id: req.user.id });
    await user.updateOne({ $push: { blogs: createdBlog._id } });
    await user.save();

    return res.status(201).json({
      status: true,
      message: "Blog created successfully",
      blog: createdBlog,
    });
  } catch (err) {
    err.source = "create blog conroller";
    next(err);
  }
};

// get a list of blogs for a particular user
const getAListOfUserBlogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, state } = req.query;
    const query = state ? { state } : {};
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "This user does not exist",
      });
    }

    if (req.user.id !== user.id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to get this user's blog",
      });
    }

    const blogs = await Blog.find({ authorID: id })
      .find(query)
      .populate("authorID", { username: 1 })
      .skip(page > 0 ? page * 10 : 0)
      .limit(10);

    return res.json({
      status: true,
      blogs: blogs,
    });
  } catch (err) {
    err.source = "get user blogs controller";
    next(err);
  }
};

// update a blog
const updateBlog = async (req, res, next) => {
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

    if (req.user.id !== blog.authorID.id) {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to update this blog",
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
      message: "Blog updated successfully",
      blog: updatedBlog,
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
    const blog = await Blog.findById(id).populate("authorID", { username: 1 });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "This blog does not exist",
      });
    }

    if (req.user.id !== blog.authorID.id) {
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
    err.source = "Publish blog controller";
    next(err);
  }
};

// delete a blog
const deleteBlog = async (req, res, next) => {
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

    if (req.user.id !== blog.authorID.id) {
      return res.status(401).json({
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
  getAListOfUserBlogs,
  updateBlog,
  publishBlog,
  deleteBlog,
};

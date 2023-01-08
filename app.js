const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler } = require("./middlewares/errorHandler");
const { limiter } = require("./middlewares/limiter");

// routes
const user = require("./routes/user.routes");
const blog = require("./routes/blog.routes");

const app = express();

// use cors
app.use(cors());

// parse information from request body
app.use(express.json());

//middelewares
app.use(helmet());
app.use(limiter);
app.use(errorHandler);

app.use("/", user);
app.use("/api/v1/blog", blog);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send({
    status: true,
    message: "Welcome to your Blog",
  });
});

// Undefined route
app.get("*", (req, res) => {
  return res.status(404).send({
    status: false,
    message: "Route not found",
  });
});

module.exports = app;

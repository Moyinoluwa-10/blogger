const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./config/config");

// Connect to MongoDB
require("./database/db").connectToMongoDB();

// routes
const user = require("./routes/user");
const blog = require("./routes/blog");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// parse information from request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", user);
app.use("/api/blog", blog);
app.use(errorHandler);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Welcome to your Blog",
    status: true,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

const mongoose = require("mongoose");
const { MONGODB_URL } = require("../config/config");

function connectToMongoDB() {
  mongoose.connect(MONGODB_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = { connectToMongoDB };

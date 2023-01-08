const mongoose = require("mongoose");
const { MONGODB_URL } = require("../config/config");
const logger = require("../logging/logger");

function connectToMongoDB() {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    logger.info("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("An error occurred while connecting to MongoDB");
    logger.error(err);
  });
}

module.exports = { connectToMongoDB };

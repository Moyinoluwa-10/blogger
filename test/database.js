const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
// const logger = require("../logging/logger");

let mongoDb = MongoMemoryServer;

const connect = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();
  await mongoose.connect(uri);
  // logger.info("Connected to MongoDB Successfully");
};

const cleanup = async () => {
  await mongoose.connection.dropDatabase();
};

const disconnect = async () => {
  await mongoose.disconnect();
  await mongoDb.stop();
  // logger.info("Disconnected from MongoDB Successfully");
};

module.exports = {
  connect,
  cleanup,
  disconnect,
};


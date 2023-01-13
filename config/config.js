// access the values in the .env file

require("dotenv").config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URL =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URL
    : process.env.MONGODB_URL;

module.exports = {
  PORT,
  MONGODB_URL,
  JWT_SECRET,
};

const app = require("./app");
const { PORT } = require("./config/config");
// const logger = require("./logging/logger");

// Connect to MongoDB
require("./database/db").connectToMongoDB();

// Start the server
app.listen(PORT, () => {
  // logger.info(`Server is running on port http://localhost:${PORT}`);
  console.log(`Server is running on port http://localhost:${PORT}`);
});

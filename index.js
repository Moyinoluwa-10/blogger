const app = require("./app");
const { PORT } = require("./config/config");

// Connect to MongoDB
require("./database/db").connectToMongoDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

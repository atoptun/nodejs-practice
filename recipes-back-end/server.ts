import "dotenv/config";
import app from "./app.ts";
import logger from "./src/logger.ts";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Server is running on port 3000");
  console.log(`Server is running on http://localhost:${PORT}`);
});

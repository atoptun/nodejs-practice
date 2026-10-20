import express from "express";
import apiApp from "./api/api-app.js";
import webApp from "./web/web-app.js";

const mainApp = express();
const PORT = 3000;

mainApp.use("/api", apiApp);
mainApp.use("/", webApp);

mainApp.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webRouter from "./routes/index.js";
import { getRootDir } from "../utils/utils.js";
import { commonErrors, multerErrors } from "./middlewares/errors.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webApp = express();

webApp.use(express.urlencoded({ extended: true }));

webApp.set("view engine", "ejs");
webApp.set("views", path.join(getRootDir(), "src", "web", "views"));
webApp.use(
  "/static",
  express.static(path.join(getRootDir(), "public"), {
    maxAge: 0, // "1d",
    etag: true, // 304 if file not changed
  }),
);

webApp.use(webRouter);

webApp.use(multerErrors);
webApp.use(commonErrors);

export default webApp;

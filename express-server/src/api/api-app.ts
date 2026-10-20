import express from "express";
import apiRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";

const apiApp = express();

apiApp.use(express.json());

apiApp.use(apiRouter);

apiApp.use(notFoundMiddleware);
apiApp.use(errorMiddleware);

export default apiApp;

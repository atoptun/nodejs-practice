import { Router } from "express";
import booksRouter from "./books.js";
import getStatus from "../controllers/status.controller.js";
import recipesRouter from "./recipes.router.ts";

const apiRouter = Router();

apiRouter.use("/status", getStatus);

apiRouter.use("/books", booksRouter);

apiRouter.use("/recipes", recipesRouter);

export default apiRouter;

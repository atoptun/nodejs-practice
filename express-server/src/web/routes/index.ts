import { Router } from "express";
import booksRouter from "./books.router.js";
import userRouter from "./users.router.js";
import uploadsRouter from "./uploads.router.js";

const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.render("index", { title: "Головна" });
});

webRouter.get("/about", (req, res) => {
  res.render("about");
});

webRouter.use(booksRouter);

webRouter.use("/users", userRouter);

webRouter.use("/uploads", uploadsRouter);

export default webRouter;

import { Router, type Request, type Response } from "express";
import { getBooks, getIndex } from "../controllers/books.controller.js";
import { getArticle } from "../controllers/articles.controller.js";

const booksRouter = Router();
export default booksRouter;

booksRouter.get("/", getIndex);

booksRouter.get("/books", getBooks);

booksRouter.get("/dangerous", (req, res) => {
  const userInput = '<script>alert("XSS атака!")</script>';
  res.render("dangerous", { userInput: userInput });
});

booksRouter.get("/article", getArticle);

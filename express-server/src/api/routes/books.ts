import { Router } from "express";
import {
  deleteBookById,
  getAuthorBookById,
  getBookById,
  getBooks,
  patchBookById,
  postBookCreate,
  putBookById,
} from "../controllers/books.controller.js";
import { logRequest } from "../middlewares/log-request.middleware.js";
import {
  checkBookTitleDuplicates,
  checkCreateBookRequest,
} from "../middlewares/books.middleware.js";

const booksRouter = Router();

export default booksRouter;

booksRouter.get("/", getBooks);

booksRouter.get("/:id", getBookById);

booksRouter.get("/authors/:authorId/books/:bookId", getAuthorBookById);

booksRouter.post(
  "/",
  logRequest,
  checkCreateBookRequest,
  checkBookTitleDuplicates,
  postBookCreate,
);

booksRouter.patch("/:id", patchBookById);

booksRouter.put("/:id", putBookById);

booksRouter.delete("/:id", deleteBookById);

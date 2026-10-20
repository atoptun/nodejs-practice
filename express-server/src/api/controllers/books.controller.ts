import type { Request, Response } from "express";
import type {
  Book,
  CreateBookBody,
  UpdateBookBody,
} from "../../types/books.js";
import { getBooksFromStorage, saveBooksToStorage } from "../../utils/books.js";
import { AppError } from "../../types/errors.js";

export const getBooks = async (req: Request, res: Response) => {
  const author = req.query.author as string | undefined;
  const sortBy = req.query.sortBy as string | undefined;

  const books = await getBooksFromStorage();

  let result = [...books];

  if (author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase()),
    );
  }

  if (sortBy === "title") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  res.json(result);
};

export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const bookId = parseInt(req.params.id);

  if (isNaN(bookId)) {
    throw new AppError("Book ID must be a number", 400);
  }

  const books = await getBooksFromStorage();

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    throw new AppError(`Book with id ${bookId} not found`, 404);
  }
  res.json(book);
};

export const getAuthorBookById = async (
  req: Request<{ authorId: string; bookId: string }>,
  res: Response,
) => {
  const authorId = req.params.authorId;
  const bookId = req.params.bookId;

  res.json({
    message: "Requested specific book from specific author",
    authorId: authorId,
    bookId: bookId,
  });
};

export const postBookCreate = async (
  req: Request<{}, {}, CreateBookBody>,
  res: Response,
) => {
  const books = await getBooksFromStorage();

  const newBook: Book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  res.status(201).json(newBook);
};

export const patchBookById = async (
  req: Request<{ id: string }, {}, UpdateBookBody>,
  res: Response,
) => {
  const books = await getBooksFromStorage();

  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (req.body.title) {
    book.title = req.body.title;
  }

  if (req.body.author) {
    book.author = req.body.author;
  }

  saveBooksToStorage(books);

  res.json(book);
};

export const putBookById = async (
  req: Request<{ id: string }, {}, UpdateBookBody>,
  res: Response,
) => {
  res.json({
    message: "Book replaced successfully",
  });
};

export const deleteBookById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  res.json({
    message: "Book deleted successfully",
  });
};

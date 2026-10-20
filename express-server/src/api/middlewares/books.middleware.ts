import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../types/errors.js";
import { getBooksFromStorage } from "../../utils/books.js";

export const checkCreateBookRequest = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title || !req.body.author) {
    throw new AppError("Title and author are required", 400);
  }
  next();
};

export const checkBookTitleDuplicates = async (req: Request, res: Response, next: NextFunction) => {
  const books = await getBooksFromStorage()

  const exists = books.find(
    (b) => b.title.toLowerCase() === req.body.title.toLowerCase(),
  );

  if (exists) {
    throw new AppError("Book with this title already existed", 409);
  }
  next();
};

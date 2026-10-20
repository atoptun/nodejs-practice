import type { Request, Response } from "express";
import { getBooksFromStorage } from "../../utils/books.js";

export const getIndex = async (req: Request, res: Response) => {
  res.render("index");
};

export const getBooks = async (req: Request, res: Response) => {
  const books = await getBooksFromStorage();
  res.render("books", { books });
};

import path from "node:path";
import { getDataDir } from "./utils.js";
import { readFile, writeFile } from "node:fs/promises";
import type { Book } from "../types/books.js";

const booksDataFile = path.join(getDataDir(), "books.json");

export const getBooksFromStorage = async (): Promise<Book[]> => {
  const data = await readFile(booksDataFile, "utf-8");
  return JSON.parse(data) as Book[];
};

export const saveBooksToStorage = async (books: Book[]): Promise<void> => {
  const data = JSON.stringify(books, null, 2);
  await writeFile(booksDataFile, data, "utf-8");
};

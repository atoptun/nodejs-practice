import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { InvalidFileTypeError } from "../../types/errors.js";

export const multerErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("Файл занадто великий. Максимум 5MB");
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).send("Занадто багато файлів");
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send("Неочікуване поле з файлом");
    }
    return res.status(400).send(`Помилка завантаження: ${err.message}`);
  }

  if (err instanceof InvalidFileTypeError) {
    return res.status(400).send(err.message);
  }

  next(err);
};

export const commonErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Server error:", err);
  res.status(500).send("Внутрішня помилка сервера");
};

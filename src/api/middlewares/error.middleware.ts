import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../types/errors.js";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.status).json({
      error: {
        message: error.message,
        status: error.status,
      },
    });
  }

  const prismaErrorMap: Record<string, { status: number; message: string }> = {
    P2025: { status: 404, message: "Запис не знайдено" },
    P2003: { status: 400, message: "Зв'язаний запис не існує" },
    P2002: { status: 400, message: "Запис з такими даними вже існує" },
    P2026: { status: 400, message: "Порушення обмеження унікальності" },
    P2014: { status: 400, message: "Помилка зв'язку між записами" },
    P2009: { status: 400, message: "Помилка валідації даних" },
  };

  if ("code" in error && prismaErrorMap[(error as any).code]) {
    const err = prismaErrorMap[(error as any).code];
    if (err?.status && err?.message) {
      return res.status(err.status).json({
        message: err.message,
        code: (error as any).code,
      });
    }
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    (error as any).status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      error: "Invalid JSON in request body",
    });
  }

  res.status(500).json({
    error: {
      message: "Internal server error",
      status: 500,
    },
  });
};

export default errorMiddleware;

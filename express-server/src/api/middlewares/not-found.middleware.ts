import type { NextFunction, Request, Response } from "express";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.send({ error: `Method ${req.method} ${req.url} not found` });
};

export default notFoundMiddleware
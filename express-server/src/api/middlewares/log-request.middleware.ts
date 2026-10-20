import type { NextFunction, Request, Response } from "express";

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Creating book: ${req.body.title}`);
  next();
};

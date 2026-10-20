import type { Request, Response } from "express";

const getStatus = (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export default getStatus;

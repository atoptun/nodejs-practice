import express from "express";
import type { NextFunction, Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).render("404", {
    message: "Сторінку не знайдено",
  });
});

// Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).render("error");
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

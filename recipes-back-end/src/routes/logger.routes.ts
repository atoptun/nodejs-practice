import { Request, Response, Router } from "express";
import logger from "../logger.ts";
import { pinoHttp } from "pino-http";

const router = Router();

router.use(pinoHttp({ logger }));

router.get("/hello", (req: Request, res: Response) => {
  logger.info("Received request to /hello");
  req.log.debug("Debug info - visible only in development");
  req.log.info("Processing hello request");
  res.json({ message: "Hello!" });
});

router.get("/error", (req: Request, res: Response) => {
  logger.error("Something went wrong");
  res.status(500).json({ error: "Internal server error" });
});

router.post("/login", (req: Request, res: Response) => {
  const { email } = req.body;

  logger.info({ email }, "Login attempt");

  if (email === "admin@example.com") {
    logger.info({ email }, "Login successful");
    res.json({ message: "Welcome!" });
  } else {
    logger.warn({ email }, "Login failed: unknown email");
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/users/:id", (req: Request, res: Response) => {
  req.log.info({ userId: req.params.id }, "Fetching user");
  res.json({ id: req.params.id, name: "John" });
});

export default router;

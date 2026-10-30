import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./src/routes/auth.routes.ts";
import recipesRoutes from "./src/routes/recipes.routes.ts";
import categoriesRoutes from "./src/routes/categories.routes.ts";
import tagsRoutes from "./src/routes/tags.routes.ts";
import reviewsRoutes from "./src/routes/reviews.routes.ts";
import loggerRoutes from "./src/routes/logger.routes.ts";
import uploadeRoutes from "./src/routes/uploder.routes.ts";
import mailerRoutes from "./src/routes/mailer.routes.ts";
import { generateOpenApiDocument } from "./src/openapi.ts";
import notFound from "./src/middleware/not-found.ts";
import errorHandler from "./src/middleware/error-handler.ts";
import logger from "./src/logger.ts";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const app = express();

// 1
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Total-Count"],
    credentials: true,
    maxAge: 86400,
  }),
);

// 2
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// 3
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

app.use(globalLimiter);

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});

// 4
app.use(express.json());
app.use(cookieParser());

// 5
const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/auth", strictLimiter, authRouter);
app.use("/api/recipes", recipesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api", reviewsRoutes);

app.use("/logger", loggerRoutes);
app.use("/upload", uploadeRoutes);
app.use("/mailer", mailerRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

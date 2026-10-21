import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.ts";
import recipesRoutes from "./src/routes/recipes.routes.ts";
import categoriesRoutes from "./src/routes/categories.routes.ts";
import tagsRoutes from "./src/routes/tags.routes.ts";
import reviewsRoutes from "./src/routes/reviews.routes.ts";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./src/openapi.ts";
import notFound from "./src/middleware/not-found.ts";
import errorHandler from "./src/middleware/error-handler.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());

const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api", reviewsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

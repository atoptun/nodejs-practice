import express from "express";
import authenticate from "../middleware/authenticate.ts";
import * as categoriesController from "../controllers/categories.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import {
  CategoryParamsSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../validators/category.validator.ts";

const router = express.Router();

router.get("/", categoriesController.getAllCategories);

router.get(
  "/:id",
  validateParams(CategoryParamsSchema),
  categoriesController.getCategoryById,
);

router.post(
  "/",
  authenticate,
  validateBody(CreateCategorySchema),
  categoriesController.createCategory,
);

router.patch(
  "/:id",
  authenticate,
  validateParams(CategoryParamsSchema),
  validateBody(UpdateCategorySchema),
  categoriesController.updateCategory,
);

router.delete(
  "/:id",
  authenticate,
  validateParams(CategoryParamsSchema),
  categoriesController.deleteCategory,
);

export default router;

import express from "express";
import * as categoriesController from "../controllers/categories.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import { CategoryParamsSchema, CreateCategorySchema, UpdateCategorySchema } from "../validators/category.validator.ts";

const router = express.Router();

router.get("/", categoriesController.getAllCategories);
router.get(
  "/:id",
  validateParams(CategoryParamsSchema),
  categoriesController.getCategoryById,
);
router.post(
  "/",
  validateBody(CreateCategorySchema),
  categoriesController.createCategory,
);
router.patch(
  "/:id",
  validateParams(CategoryParamsSchema),
  validateBody(UpdateCategorySchema),
  categoriesController.updateCategory,
);
router.delete(
  "/:id",
  validateParams(CategoryParamsSchema),
  categoriesController.deleteCategory,
);

export default router;

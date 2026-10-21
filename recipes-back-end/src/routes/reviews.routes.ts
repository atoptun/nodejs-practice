import express from "express";
import * as reviewsController from "../controllers/reviews.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import { CreateReviewSchema, RecipeReviewParamsSchema, ReviewParamsSchema, UpdateReviewSchema } from "../validators/review.validator.ts";

const router = express.Router();

// Nested routes для роботи з reviews конкретного рецепту
router.get(
  "/recipes/:recipeId/reviews",
  validateParams(RecipeReviewParamsSchema),
  reviewsController.getReviewsByRecipe,
);
router.post(
  "/recipes/:recipeId/reviews",
  validateParams(RecipeReviewParamsSchema),
  validateBody(CreateReviewSchema),
  reviewsController.createReview,
);

// Flat routes для операцій з конкретним review
router.patch(
  "/reviews/:id",
  validateParams(ReviewParamsSchema),
  validateBody(UpdateReviewSchema),
  reviewsController.updateReview,
);
router.delete(
  "/reviews/:id",
  validateParams(ReviewParamsSchema),
  reviewsController.deleteReview,
);

export default router;

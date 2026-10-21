import express from "express";
import authenticate from "../middleware/authenticate.ts";
import * as reviewsController from "../controllers/reviews.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import { CreateReviewSchema, RecipeReviewParamsSchema, ReviewParamsSchema, UpdateReviewSchema } from "../validators/review.validator.ts";

const router = express.Router();

router.get(
  "/recipes/:recipeId/reviews",
  validateParams(RecipeReviewParamsSchema),
  reviewsController.getReviewsByRecipe,
);

router.post(
  "/recipes/:recipeId/reviews",
  authenticate,
  validateParams(RecipeReviewParamsSchema),
  validateBody(CreateReviewSchema),
  reviewsController.createReview,
);

// Flat routes для операцій з конкретним review
router.patch(
  "/reviews/:id",
  authenticate,
  validateParams(ReviewParamsSchema),
  validateBody(UpdateReviewSchema),
  reviewsController.updateReview,
);

router.delete(
  "/reviews/:id",
  authenticate,
  validateParams(ReviewParamsSchema),
  reviewsController.deleteReview,
);

export default router;

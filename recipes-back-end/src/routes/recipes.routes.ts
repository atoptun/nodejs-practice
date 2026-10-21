import express from "express";
import authenticate from "../middleware/authenticate.ts";
import * as recipesController from "../controllers/recipes.controller.ts";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validate.ts";
import {
  CreateRecipeSchema,
  GetRecipesQuerySchema,
  RecipeParamsSchema,
  UpdateRecipeSchema,
} from "../validators/recipe.validator.ts";

const router = express.Router();

router.get(
  "/",
  validateQuery(GetRecipesQuerySchema),
  recipesController.getAllRecipes,
);

router.get(
  "/:id",
  validateParams(RecipeParamsSchema),
  recipesController.getRecipeById,
);

router.post(
  "/",
  authenticate,
  validateBody(CreateRecipeSchema),
  recipesController.createRecipe,
);

router.patch(
  "/:id",
  authenticate,
  validateParams(RecipeParamsSchema),
  validateBody(UpdateRecipeSchema),
  recipesController.updateRecipe,
);

router.delete(
  "/:id",
  authenticate,
  validateParams(RecipeParamsSchema),
  recipesController.deleteRecipe,
);

export default router;

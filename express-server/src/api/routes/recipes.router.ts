import { Router } from "express";
import {
  deleteRecipe,
  getRecipeById,
  getRecipes,
  patchRecipe,
  postRecipes,
} from "../controllers/recipes.controller.ts";

const recipesRouter = Router();

export default recipesRouter;

recipesRouter.get("/", getRecipes);
recipesRouter.get("/:id", getRecipeById);
recipesRouter.post("/", postRecipes);
recipesRouter.patch("/:id", patchRecipe);
recipesRouter.delete("/:id", deleteRecipe);

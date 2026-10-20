import type { NextFunction, Request, Response } from "express";
import type { CreateRecipeBody } from "../../types/recipes.ts";
import { AppError } from "../../types/errors.ts";


export const postRecipesValidator = (  req: Request<{}, {}, CreateRecipeBody>,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    chefName,
    categoryId,
  } = req.body;

  if (!title || !ingredients || !instructions) {
    throw new AppError(
      "Поля title, ingredients та instructions є обов'язковими",
      400,
    );
  }

  if (!cookingTime || cookingTime <= 0) {
    throw new AppError("Час приготування має бути більшим за 0", 400);
  }

  if (!servings || servings <= 0) {
    throw new AppError("Кількість порцій має бути більшою за 0", 400);
  }

  if (!difficulty || difficulty <= 0) {
    throw new AppError("Складність має бути більшою за 0", 400);
  }

  if (!categoryId) {
    throw new AppError("Необхідно вказати категорію", 400);
  }

}
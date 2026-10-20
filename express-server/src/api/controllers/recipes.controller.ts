import { type Request, type Response, type NextFunction } from "express";
import prisma from "../../recipes-db/db.ts";
import type { RecipeWhereInput } from "../../generated/prisma/models.ts";
import { AppError } from "../../types/errors.ts";
import type {
  CreateRecipeBody,
  UpdateRecipeBody,
} from "../../types/recipes.ts";

export const getRecipes = async (
  req: Request<
    {},
    {},
    {},
    { category?: string; maxTime?: string; search?: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { category, maxTime, search } = req.query;

  const where: RecipeWhereInput = {};

  if (category) {
    const categoryId = parseInt(category);
    if (!isNaN(categoryId)) {
      where.categoryId = categoryId;
    }
  }

  if (maxTime) {
    const time = parseInt(maxTime);
    if (!isNaN(time) && time > 0) {
      where.cookingTime = { lte: time };
    }
  }

  if (search) {
    where.title = {
      contains: search,
    };
  }

  const recipes = await prisma.recipe.findMany({
    where,
    include: {
      category: true,
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(recipes);
};

export const getRecipeById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const recipeId = parseInt(req.params.id);

  if (isNaN(recipeId)) {
    throw new AppError("ID рецепта має бути числом", 400);
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      category: true,
      tags: true,
      reviews: true,
    },
  });

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  res.json(recipe);
};

export const postRecipes = async (
  req: Request<{}, {}, CreateRecipeBody>,
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

  const recipe = await prisma.recipe.create({
    data: {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      chefName: chefName || "Анонім",
      categoryId,
    },
    include: {
      category: true,
    },
  });

  res.status(201).json(recipe);
};

export const patchRecipe = async (
  req: Request<{ id: string }, {}, UpdateRecipeBody>,
  res: Response,
  next: NextFunction,
) => {
  const recipeId = parseInt(req.params.id);

  if (isNaN(recipeId)) {
    throw new AppError("ID рецепта має бути числом", 400);
  }

  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    chefName,
  } = req.body;

  if (cookingTime !== undefined && cookingTime <= 0) {
    throw new AppError("Час приготування має бути більшим за 0", 400);
  }

  if (servings !== undefined && servings <= 0) {
    throw new AppError("Кількість порцій має бути більшою за 0", 400);
  }

  if (difficulty !== undefined && difficulty <= 0) {
    throw new AppError("Складність має бути більшою за 0", 400);
  }

  const dataToUpdate = {
    ...(title !== undefined && { title }),
    ...(ingredients !== undefined && { ingredients }),
    ...(instructions !== undefined && { instructions }),
    ...(cookingTime !== undefined && { cookingTime }),
    ...(servings !== undefined && { servings }),
    ...(difficulty !== undefined && { difficulty }),
    ...(chefName !== undefined && { chefName }),
  };

  const recipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: dataToUpdate,
    include: {
      category: true,
    },
  });

  res.json(recipe);
};


export const deleteRecipe = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const recipeId = parseInt(req.params.id);

  if (isNaN(recipeId)) {
    throw new AppError("ID рецепта має бути числом", 400);
  }

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  res.status(204).send();
};
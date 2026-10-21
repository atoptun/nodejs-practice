import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";
import type { Prisma } from "../../generated/prisma/client.ts";
import {
  CreateRecipeBody,
  GetRecipesQuery,
  RecipeParams,
  UpdateRecipeBody,
} from "../validators/recipe.validator.ts";

export const getAllRecipes = async (
  req: Request,
  res: Response<any, { query: GetRecipesQuery }>,
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    categoryId,
    search,
  } = res.locals.query;

  const skip = (page - 1) * limit;
  const take = limit;

  const where: Prisma.RecipeWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const orderBy: Prisma.RecipeOrderByWithRelationInput = {};
  orderBy[sortBy] = order;

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: true,
        tags: true,
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  res.status(200).json({
    data: recipes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};


export const getRecipeById = async (
  req: Request<RecipeParams>,
  res: Response,
) => {
  const { id } = req.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
      reviews: true,
    },
  });

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.status(200).json(recipe);
};

export const createRecipe = async (
  req: Request<{}, {}, CreateRecipeBody>,
  res: Response,
) => {
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
    categoryId,
    tagIds,
  } = req.body;

  const recipe = await prisma.recipe.create({
    data: {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      chefName,
      category: {
        connect: { id: categoryId },
      },
      tags: {
        connect: tagIds?.map((id) => ({ id })),
      },
    },
    include: {
      category: true,
      tags: true,
    },
  });

  res.status(201).json(recipe);
};

export const updateRecipe = async (
  req: Request<RecipeParams, {}, UpdateRecipeBody>,
  res: Response,
) => {
  const { id } = req.params;
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
    categoryId,
    tagIds,
  } = req.body;

  const updateData: Prisma.RecipeUpdateInput = {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
  };

  if (categoryId !== undefined) {
    updateData.category = {
      connect: { id: categoryId },
    };
  }

  if (tagIds !== undefined) {
    updateData.tags = {
      set: tagIds.map((id) => ({ id })),
    };
  }

  const recipe = await prisma.recipe.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      tags: true,
    },
  });

  res.status(200).json(recipe);
};

export const deleteRecipe = async (
  req: Request<RecipeParams>,
  res: Response,
) => {
  const { id } = req.params;

  await prisma.recipe.delete({
    where: { id },
  });

  res.status(204).send();
};

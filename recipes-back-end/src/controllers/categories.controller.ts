import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";
import {
  CategoryParams,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "../validators/category.validator.ts";

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
};

export const getCategoryById = async (
  req: Request<CategoryParams>,
  res: Response,
) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { recipes: true },
  });

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.status(200).json(category);
};

export const createCategory = async (
  req: Request<{}, {}, CreateCategoryBody>,
  res: Response,
) => {
  const { name, description } = req.body;

  const category = await prisma.category.create({
    data: { name, description },
  });

  res.status(201).json(category);
};

export const updateCategory = async (
  req: Request<CategoryParams, {}, UpdateCategoryBody>,
  res: Response,
) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await prisma.category.update({
    where: { id },
    data: { name, description },
  });

  res.status(200).json(category);
};

export const deleteCategory = async (
  req: Request<CategoryParams>,
  res: Response,
) => {
  const { id } = req.params;

  await prisma.category.delete({
    where: { id },
  });

  res.status(204).send();
};

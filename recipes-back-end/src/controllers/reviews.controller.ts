import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";
import {
  CreateReviewBody,
  RecipeReviewParams,
  ReviewParams,
  UpdateReviewBody,
} from "../validators/review.validator.ts";

export const getReviewsByRecipe = async (
  req: Request<RecipeReviewParams>,
  res: Response,
) => {
  const { recipeId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { recipeId },
  });

  res.status(200).json(reviews);
};

export const createReview = async (
  req: Request<RecipeReviewParams, {}, CreateReviewBody>,
  res: Response,
) => {
  const { recipeId } = req.params;
  const { content, rating, reviewerName } = req.body;

  const review = await prisma.review.create({
    data: {
      content,
      rating,
      reviewerName,
      recipe: {
        connect: { id: recipeId },
      },
    },
  });

  res.status(201).json(review);
};

export const updateReview = async (
  req: Request<ReviewParams, {}, UpdateReviewBody>,
  res: Response,
) => {
  const { id } = req.params;
  const { content, rating } = req.body;

  const review = await prisma.review.update({
    where: { id },
    data: { content, rating },
  });

  res.status(200).json(review);
};

export const deleteReview = async (
  req: Request<ReviewParams>,
  res: Response,
) => {
  const { id } = req.params;

  await prisma.review.delete({
    where: { id },
  });

  res.status(204).send();
};

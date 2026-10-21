import type { Request, Response } from "express";
import createHttpError from "http-errors";
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
    include: {
      user: { select: { id: true, username: true, name: true } },
    },
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
      user: {
        connect: { id: Number(req.user!.sub) },
      },
      recipe: {
        connect: { id: recipeId },
      },
    },
    include: {
      user: { select: { id: true, username: true, name: true } },
    },
  });

  res.status(201).json(review);
};

export const updateReview = async (
  req: Request<ReviewParams, {}, UpdateReviewBody>,
  res: Response,
) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw createHttpError(404, "Review not found");
  }

  if (review.userId !== Number(req.user!.sub)) {
    throw createHttpError(403, "You can only edit your own reviews");
  }

  const { content, rating } = req.body;

  const updated = await prisma.review.update({
    where: { id },
    data: { content, rating },
    include: {
      user: { select: { id: true, username: true, name: true } },
    },
  });

  res.status(200).json(updated);
};

export const deleteReview = async (
  req: Request<ReviewParams>,
  res: Response,
) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw createHttpError(404, "Review not found");
  }

  if (review.userId !== Number(req.user!.sub)) {
    throw createHttpError(403, "You can only delete your own reviews");
  }

  await prisma.review.delete({
    where: { id },
  });

  res.status(204).send();
};

import { z } from "zod";
import { registry } from "../openapi.ts";

export const ReviewParamsSchema = registry.register(
  "ReviewParams",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
);

export const RecipeReviewParamsSchema = registry.register(
  "RecipeReviewParams",
  z.object({
    recipeId: z.coerce.number().int().positive(),
  }),
);

export const CreateReviewSchema = registry.register(
  "CreateReview",
  z.object({
    content: z.string().min(10).max(500),
    rating: z.number().int().min(1).max(5),
    reviewerName: z.string().min(2).max(50),
  }),
);

export const UpdateReviewSchema = registry.register(
  "UpdateReview",
  CreateReviewSchema.pick({ content: true, rating: true })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      error: "At least one field must be provided",
    }),
);

export type ReviewParams = z.infer<typeof ReviewParamsSchema>;
export type RecipeReviewParams = z.infer<typeof RecipeReviewParamsSchema>;
export type CreateReviewBody = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewBody = z.infer<typeof UpdateReviewSchema>;

registry.registerPath({
  method: "get",
  path: "/api/recipes/{recipeId}/reviews",
  tags: ["Reviews"],
  summary: "Get reviews for a recipe",
  request: { params: RecipeReviewParamsSchema },
  responses: {
    200: { description: "List of reviews retrieved successfully" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/recipes/{recipeId}/reviews",
  tags: ["Reviews"],
  summary: "Create review for a recipe",
  request: {
    params: RecipeReviewParamsSchema,
    body: {
      content: { "application/json": { schema: CreateReviewSchema } },
    },
  },
  responses: {
    201: { description: "Review created successfully" },
    400: { description: "Recipe not found" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/reviews/{id}",
  tags: ["Reviews"],
  summary: "Update review",
  request: {
    params: ReviewParamsSchema,
    body: {
      content: { "application/json": { schema: UpdateReviewSchema } },
    },
  },
  responses: {
    200: { description: "Review updated successfully" },
    404: { description: "Review not found" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/reviews/{id}",
  tags: ["Reviews"],
  summary: "Delete review",
  request: { params: ReviewParamsSchema },
  responses: {
    204: { description: "Review deleted successfully" },
    404: { description: "Review not found" },
  },
});

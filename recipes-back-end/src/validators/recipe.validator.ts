import { z } from "zod";
import { registry } from "../openapi.ts";

export const RecipeParamsSchema = registry.register(
  "RecipeParams",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
);

export const CreateRecipeSchema = registry.register(
  "CreateRecipe",
  z.object({
    title: z.string().min(3).max(100),
    ingredients: z.array(z.string()).min(1),
    instructions: z.string().min(20),
    cookingTime: z.number().int().min(1).max(1440),
    servings: z.number().int().min(1).max(100),
    chefName: z.string().min(2).max(50),
    categoryId: z.number().int().positive(),
    tagIds: z.array(z.number().int().positive()).optional(),
  }),
);

export const UpdateRecipeSchema = registry.register(
  "UpdateRecipe",
  CreateRecipeSchema.omit({ tagIds: true })
    .extend({ tagIds: z.array(z.number().int().positive()).optional() })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      error: "At least one field must be provided",
    }),
);

export const GetRecipesQuerySchema = registry.register(
  "GetRecipesQuery",
  z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z
      .enum(["createdAt", "cookingTime", "servings", "title"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    search: z.string().min(1).max(100).optional(),
  }),
);

export type RecipeParams = z.infer<typeof RecipeParamsSchema>;
export type CreateRecipeBody = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeSchema>;
export type GetRecipesQuery = z.infer<typeof GetRecipesQuerySchema>;

registry.registerPath({
  method: "get",
  path: "/api/recipes",
  tags: ["Recipes"],
  summary: "Get all recipes with pagination, filtering and sorting",
  request: {
    query: GetRecipesQuerySchema,
  },
  responses: {
    200: { description: "List of recipes with pagination metadata" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/recipes/{id}",
  tags: ["Recipes"],
  summary: "Get recipe by ID",
  request: {
    params: RecipeParamsSchema,
  },
  responses: {
    200: { description: "Recipe retrieved successfully" },
    404: { description: "Recipe not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/recipes",
  tags: ["Recipes"],
  summary: "Create new recipe",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateRecipeSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "Recipe created successfully" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/recipes/{id}",
  tags: ["Recipes"],
  summary: "Update recipe",
  request: {
    params: RecipeParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateRecipeSchema,
        },
      },
    },
  },
  responses: {
    200: { description: "Recipe updated successfully" },
    404: { description: "Recipe not found" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/recipes/{id}",
  tags: ["Recipes"],
  summary: "Delete recipe",
  request: {
    params: RecipeParamsSchema,
  },
  responses: {
    204: { description: "Recipe deleted successfully" },
    404: { description: "Recipe not found" },
  },
});

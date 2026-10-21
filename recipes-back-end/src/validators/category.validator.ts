import { z } from "zod";
import { registry } from "../openapi.ts";

export const CategoryParamsSchema = registry.register(
  "CategoryParams",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
);

export const CreateCategorySchema = registry.register(
  "CreateCategory",
  z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(200).optional(),
  }),
);

export const UpdateCategorySchema = registry.register(
  "UpdateCategory",
  z
    .object({
      name: z.string().min(2).max(50).optional(),
      description: z.string().max(200).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      error: "At least one field must be provided",
    }),
);

export type CategoryParams = z.infer<typeof CategoryParamsSchema>;
export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryBody = z.infer<typeof UpdateCategorySchema>;

registry.registerPath({
  method: "get",
  path: "/api/categories",
  tags: ["Categories"],
  summary: "Get all categories",
  responses: {
    200: { description: "List of categories retrieved successfully" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/categories/{id}",
  tags: ["Categories"],
  summary: "Get category by ID",
  request: { params: CategoryParamsSchema },
  responses: {
    200: { description: "Category retrieved successfully" },
    404: { description: "Category not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/categories",
  tags: ["Categories"],
  summary: "Create new category",
  request: {
    body: {
      content: { "application/json": { schema: CreateCategorySchema } },
    },
  },
  responses: {
    201: { description: "Category created successfully" },
    409: { description: "Category with this name already exists" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/categories/{id}",
  tags: ["Categories"],
  summary: "Update category",
  request: {
    params: CategoryParamsSchema,
    body: {
      content: { "application/json": { schema: UpdateCategorySchema } },
    },
  },
  responses: {
    200: { description: "Category updated successfully" },
    404: { description: "Category not found" },
    409: { description: "Category with this name already exists" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/categories/{id}",
  tags: ["Categories"],
  summary: "Delete category",
  request: { params: CategoryParamsSchema },
  responses: {
    204: { description: "Category deleted successfully" },
    404: { description: "Category not found" },
  },
});

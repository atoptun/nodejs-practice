import { z } from "zod";
import { registry } from "../openapi.ts";

export const TagParamsSchema = registry.register(
  "TagParams",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
);

export const CreateTagSchema = registry.register(
  "CreateTag",
  z.object({
    name: z.string().min(2).max(30),
  }),
);

export const UpdateTagSchema = CreateTagSchema;

export type TagParams = z.infer<typeof TagParamsSchema>;
export type CreateTagBody = z.infer<typeof CreateTagSchema>;
export type UpdateTagBody = z.infer<typeof UpdateTagSchema>;

registry.registerPath({
  method: "get",
  path: "/api/tags",
  tags: ["Tags"],
  summary: "Get all tags",
  responses: {
    200: { description: "List of tags retrieved successfully" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/tags/{id}",
  tags: ["Tags"],
  summary: "Get tag by ID",
  request: { params: TagParamsSchema },
  responses: {
    200: { description: "Tag retrieved successfully" },
    404: { description: "Tag not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/tags",
  tags: ["Tags"],
  summary: "Create new tag",
  request: {
    body: {
      content: { "application/json": { schema: CreateTagSchema } },
    },
  },
  responses: {
    201: { description: "Tag created successfully" },
    409: { description: "Tag with this name already exists" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/tags/{id}",
  tags: ["Tags"],
  summary: "Update tag",
  request: {
    params: TagParamsSchema,
    body: {
      content: { "application/json": { schema: UpdateTagSchema } },
    },
  },
  responses: {
    200: { description: "Tag updated successfully" },
    404: { description: "Tag not found" },
    409: { description: "Tag with this name already exists" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/tags/{id}",
  tags: ["Tags"],
  summary: "Delete tag",
  request: { params: TagParamsSchema },
  responses: {
    204: { description: "Tag deleted successfully" },
    404: { description: "Tag not found" },
  },
});

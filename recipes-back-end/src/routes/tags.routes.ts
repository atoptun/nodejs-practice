import express from "express";
import * as tagsController from "../controllers/tags.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import { CreateTagSchema, TagParamsSchema, UpdateTagSchema } from "../validators/tag.validator.ts";

const router = express.Router();

router.get("/", tagsController.getAllTags);
router.get("/:id", validateParams(TagParamsSchema), tagsController.getTagById);
router.post("/", validateBody(CreateTagSchema), tagsController.createTag);
router.patch(
  "/:id",
  validateParams(TagParamsSchema),
  validateBody(UpdateTagSchema),
  tagsController.updateTag,
);
router.delete(
  "/:id",
  validateParams(TagParamsSchema),
  tagsController.deleteTag,
);

export default router;

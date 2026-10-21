import express from "express";
import authenticate from "../middleware/authenticate.ts";
import * as tagsController from "../controllers/tags.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import {
  CreateTagSchema,
  TagParamsSchema,
  UpdateTagSchema,
} from "../validators/tag.validator.ts";

const router = express.Router();

router.get("/", tagsController.getAllTags);

router.get("/:id", validateParams(TagParamsSchema), tagsController.getTagById);

router.post(
  "/",
  authenticate,
  validateBody(CreateTagSchema),
  tagsController.createTag,
);

router.patch(
  "/:id",
  authenticate,
  validateParams(TagParamsSchema),
  validateBody(UpdateTagSchema),
  tagsController.updateTag,
);

router.delete(
  "/:id",
  authenticate,
  validateParams(TagParamsSchema),
  tagsController.deleteTag,
);

export default router;

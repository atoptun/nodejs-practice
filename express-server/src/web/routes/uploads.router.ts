import { Router, type Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import path from "node:path";
import {
  getUpload,
  getUploadDocs,
  getUploadMultiple,
  postUpload,
  postUploadDocs,
  postUploadMultiple,
} from "../controllers/uploads.controller.js";
import { InvalidFileTypeError } from "../../types/errors.js";

const uploadsRouter = Router();

export default uploadsRouter;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new InvalidFileTypeError("Дозволені тільки зображення (JPEG, PNG, GIF)"),
    );
  }
};

// const upload = multer({ dest: "uploads/" });
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

uploadsRouter.get("/upload", getUpload);
uploadsRouter.post("/upload", upload.single("avatar"), postUpload);

uploadsRouter.get("/upload-multiple", getUploadMultiple);
uploadsRouter.post(
  "/upload-multiple",
  upload.array("photos", 5),
  postUploadMultiple,
);

uploadsRouter.get("/upload-docs", getUploadDocs);
uploadsRouter.post(
  "/upload-docs",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "documents", maxCount: 3 },
  ]),
  postUploadDocs,
);

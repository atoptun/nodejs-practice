import { Request } from "express";
import createHttpError from "http-errors";
import multer, { FileFilterCallback } from "multer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const destination = resolve("tmp");

const allowMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

await mkdir(destination);

const storage = multer.diskStorage({
  destination,
  filename(req, file, cb) {
    const prefix = `${Date.now()}_${Math.round(Math.random() * 10000)}`;
    const fileName = `${prefix}_${file.filename}`;
    cb(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!file.mimetype) {
    return cb(createHttpError(400, "File corrupted"));
  }
  if (!allowMimeTypes.includes(file.mimetype)) {
    return cb(createHttpError(400, "Only jpeg, png and webp allowed"));
  }
  cb(null, true);
};

const uploadMiddleware = multer({
  storage,
  limits,
  fileFilter,
});

export default uploadMiddleware;

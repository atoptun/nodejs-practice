import type { Request, Response } from "express";

export const getUpload = (req: Request, res: Response) => {
  res.render("uploads/upload");
};

export const postUpload = (req: Request, res: Response) => {
  console.log("Текстові дані:", req.body);
  console.log("Файл:", req.file);
  res.render("message", { message: "Файл завантажено!" });
};

export const getUploadMultiple = (req: Request, res: Response) => {
  res.render("uploads/upload-multiple");
};

export const postUploadMultiple = (req: Request, res: Response) => {
  console.log("Завантажено файлів:", req.files!.length);
  (req.files as Express.Multer.File[]).forEach((file) => {
    console.log("Файл:", file.filename);
  });
  const message = `Завантажено ${(req.files as Express.Multer.File[]).length} файлів`;
  res.render("message", { message });
};

export const getUploadDocs = (req: Request, res: Response) => {
  res.render("uploads/upload-docs");
};

export const postUploadDocs = (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  console.log("Аватар:", files["avatar"]);
  console.log("Документи:", files["documents"]);

  const avatarCount = files["avatar"] ? files["avatar"].length : 0;
  const docsCount = files["documents"] ? files["documents"].length : 0;

  res.render("message", {
    message: `Завантажено: ${avatarCount} аватар, ${docsCount} документів`,
  });
};

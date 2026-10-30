import { Router, type Request, type Response } from "express";
import { unlink } from "fs/promises";
import uploadMiddleware from "../middleware/upload.middleware.ts";
// import multer from "multer";
import cloudinary from "../services/cloudinary.service.ts";

// const upload = multer({ dest: "tmp/" });

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send(`
    <h2>Upload Image</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// uploadMiddleware.fields([
//   {
//     name: "mainPhoto",
//     maxCount: 1,
//   },
//   {
//     name: "photos",
//     maxCount: 5,
//   },
// ]);
// uploadMiddleware.array("image", 5)

router.post(
  "/",
  uploadMiddleware.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "demo",
      });

      /**
        {
          "url": "https://res.cloudinary.com/lyycri5k/image/upload/v1793109359/demo/oubffrnsoendcl2s39nk.png",
          "publicId": "demo/oubffrnsoendcl2s39nk",
          "width": 462,
          "height": 400,
          "format": "png",
          "size": 362014
        }
       */
      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload image" });
    } finally {
      await unlink(req.file.path).catch(() => {});
    }
  },
);

router.delete("/{*publicId}", async (req: Request, res: Response) => {
  const segments = req.params.publicId;
  const publicId = Array.isArray(segments)
    ? segments.join("/")
    : typeof segments === "string"
      ? segments
      : "";

  if (!publicId) {
    return res.status(400).json({ error: "publicId is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;

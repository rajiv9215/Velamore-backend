// routes/upload.js
import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post("/upload", upload.array('product'), async (req, res) => {
  try {

    console.log("hi")
    console.log("Files received:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded" });
    }

    const cloudinaryImages = [];

    for (const file of req.files) {
      const localPath = file.path;

      console.log(`Uploading file: ${localPath}`);

      const result = await cloudinary.uploader.upload(localPath, {
        folder: "ecommerce_products",
        public_id: uuidv4(),
      });

      cloudinaryImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(localPath);
      console.log(`Deleted local file: ${localPath}`);
    }

    res.json({
      success: 1,
      images: cloudinaryImages,
    });

  } catch (err) {
    console.error("Upload Error:", err);  // ← this is critical
    res.status(500).json({ success: 0, message: "Upload failed", error: err.message });
  }
});

export default router;

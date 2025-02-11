import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer Storage (Memory)
const upload = multer({ storage: multer.memoryStorage() });

// Upload Middleware
export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'events' }, // Optional folder in Cloudinary
      (error, result) => {
        if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });

        req.image_url = result.secure_url; // Store URL in req
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: "Image upload error", error: error.message });
  }
};

// Export Multer Upload Middleware
export const uploadSingle = upload.single('image');

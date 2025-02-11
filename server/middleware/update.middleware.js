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

// Middleware for handling optional image upload
export const updateEventImage = async (req, res, next) => {
  try {
    // If no file is uploaded, proceed without updating the image
    if (!req.file) {
      return next();
    }

    // Upload new image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'events' }, // Cloudinary folder
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary upload failed", error });
        }

        req.image_url = result.secure_url; // Store the new image URL
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: "Image upload error", error: error.message });
  }
};

// Export Multer Upload Middleware
export const uploadOptional = upload.single('image');

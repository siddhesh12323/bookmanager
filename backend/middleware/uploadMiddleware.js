// middleware/upload.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage on Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "books",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

export const upload = multer({ storage });

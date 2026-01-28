const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cloudinary Main Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to create storage dynamically based on folder name
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
      ],
    },
  });
};

// Function to create storage for videos
const createCloudinaryVideoStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: "video",
      allowed_formats: ["mp4", "mov", "avi", "mkv"],
    },
  });
};

// Multer uploader generator
const uploadToCloudinary = (folder) =>
  multer({
    storage: createCloudinaryStorage(folder),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });

// Multer uploader generator for videos
const uploadVideoToCloudinary = (folder) =>
  multer({
    storage: createCloudinaryVideoStorage(folder),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  });

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadVideoToCloudinary,
};

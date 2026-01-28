const { uploadToCloudinary, cloudinary } = require("../config/cloudinary");

// Multer instances using Cloudinary storage
const uploadImage = uploadToCloudinary("startup/images");
const uploadVideo = uploadToCloudinary("startup/videos");

// Helper function to get file URL (Cloudinary provides full URL in req.file.path)
const getFileUrl = (req, file) => {
    return file ? file.path : null;
};

// Helper to delete old file
const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    // Check if it's a Cloudinary URL
    if (fileUrl.includes("cloudinary.com")) {
        try {
            // Extract public ID from URL
            // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
            const splitUrl = fileUrl.split("/");
            const filenameWithExt = splitUrl[splitUrl.length - 1];
            const folder = splitUrl[splitUrl.length - 2];
            const publicId = `${folder}/${filenameWithExt.split(".")[0]}`;

            // We need to handle the folder structure correctly based on how CloudinaryStorage saves it
            // This is a simplified extraction and might need adjustment based on exact URL format
            // For now, we'll just log it as we don't want to accidentally delete wrong things
            console.log(`[Cloudinary] Request to delete image: ${publicId} (Not implemented for safety)`);

            // To implement: await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error deleting file from Cloudinary:", error);
        }
    } else if (fileUrl.startsWith("/uploads")) {
        // Local file deletion (legacy support)
        const fs = require("fs");
        const path = require("path");
        const fullPath = path.join(__dirname, "..", fileUrl);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

module.exports = {
    uploadImage,
    uploadVideo,
    getFileUrl,
    deleteFile,
};

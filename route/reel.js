const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Reel = require("../module/reel");
const { uploadVideoToCloudinary, cloudinary } = require("../config/cloudinary");

const reelUpload = uploadVideoToCloudinary("startupBackend/reels");

// GET All Reels
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const reels = await Reel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: reels });
    })
);

// ADD Reel
router.post(
    "/",
    (req, res, next) => {
        reelUpload.single("video")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { title } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Video file is required" });
        }

        const newReel = await Reel.create({
            title,
            videoUrl: req.file.path,
            publicId: req.file.filename,
        });

        res.json({ success: true, message: "Reel added successfully", data: newReel });
    })
);

// UPDATE Reel
router.put(
    "/:id",
    (req, res, next) => {
        reelUpload.single("video")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title } = req.body;

        const reel = await Reel.findById(id);
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        reel.title = title || reel.title;

        if (req.file) {
            // Delete old video from Cloudinary if it exists
            if (reel.publicId) {
                await cloudinary.uploader.destroy(reel.publicId, { resource_type: "video" });
            }
            reel.videoUrl = req.file.path;
            reel.publicId = req.file.filename;
        }

        await reel.save();
        res.json({ success: true, message: "Reel updated successfully", data: reel });
    })
);

// DELETE Reel
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const reel = await Reel.findById(id);
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

        // Delete video from Cloudinary
        if (reel.publicId) {
            await cloudinary.uploader.destroy(reel.publicId, { resource_type: "video" });
        }

        await Reel.findByIdAndDelete(id);
        res.json({ success: true, message: "Reel deleted successfully" });
    })
);

module.exports = router;

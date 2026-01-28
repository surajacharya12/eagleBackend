const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Contributors = require("../module/contributors");
const { uploadToCloudinary } = require("../config/cloudinary");

// Cloudinary uploader for contributor avatar
const contributorUpload = uploadToCloudinary("startupBackend/contributors");

// CREATE CONTRIBUTOR
router.post(
    "/create",
    (req, res, next) => {
        contributorUpload.single("avatar")(req, res, (err) => {
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "File too large. Maximum size is 10MB",
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: err.message || "File upload error",
                });
            }
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { name, role, contributions, github, linkedin, twitter } = req.body;

        const newContributor = await Contributors.create({
            name,
            role,
            contributions,
            github,
            linkedin,
            twitter,
            avatar: req.file ? req.file.path : "",
        });

        res.status(201).json({
            success: true,
            message: "Contributor created successfully",
            data: newContributor,
        });
    })
);

// GET ALL CONTRIBUTORS
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const contributors = await Contributors.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contributors });
    })
);

// UPDATE CONTRIBUTOR
router.put(
    "/update/:id",
    (req, res, next) => {
        contributorUpload.single("avatar")(req, res, (err) => {
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "File too large. Maximum size is 10MB",
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: err.message || "File upload error",
                });
            }
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { name, role, contributions, github, linkedin, twitter } = req.body;

        const updateData = {
            name,
            role,
            contributions,
            github,
            linkedin,
            twitter,
        };

        // If a new avatar is uploaded
        if (req.file) {
            updateData.avatar = req.file.path;
        }

        const updatedContributor = await Contributors.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedContributor) {
            return res
                .status(404)
                .json({ success: false, message: "Contributor not found" });
        }

        res.json({
            success: true,
            message: "Contributor updated successfully",
            data: updatedContributor,
        });
    })
);

// DELETE CONTRIBUTOR
router.delete(
    "/delete/:id",
    asyncHandler(async (req, res) => {
        const deletedContributor = await Contributors.findByIdAndDelete(req.params.id);

        if (!deletedContributor) {
            return res
                .status(404)
                .json({ success: false, message: "Contributor not found" });
        }

        res.json({
            success: true,
            message: "Contributor deleted successfully",
        });
    })
);

module.exports = router;

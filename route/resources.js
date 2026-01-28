const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Resource = require("../module/resource");
const { uploadImage, deleteFile } = require("../utils/upload");

// Get all resources (with optional type filter)
router.get("/", asyncHandler(async (req, res) => {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
}));

// Get single resource
router.get("/:id", asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
        return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.json(resource);
}));

// Create resource with image upload
router.post("/", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const resourceData = {
        ...req.body,
        tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [],
        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // Set image path if file was uploaded
    if (req.file) {
        resourceData.image = req.file.path;
    }

    const newResource = await Resource.create(resourceData);
    res.status(201).json({ success: true, data: newResource });
}));

// Update resource with optional image upload
router.put("/:id", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const existingResource = await Resource.findById(req.params.id);
    if (!existingResource) {
        return res.status(404).json({ success: false, message: "Resource not found" });
    }

    const updateData = {
        ...req.body,
        tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : existingResource.tags,
        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // If new image uploaded, delete old one and set new path
    if (req.file) {
        if (existingResource.image) {
            deleteFile(existingResource.image);
        }
        updateData.image = req.file.path;
    }

    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedResource });
}));

// Delete resource
router.delete("/:id", asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
        return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Delete associated image file
    // Delete associated image file
    if (resource.image) {
        deleteFile(resource.image);
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resource deleted successfully" });
}));

module.exports = router;

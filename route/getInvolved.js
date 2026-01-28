const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const GetInvolved = require("../module/getInvolved");
const { uploadImage, deleteFile } = require("../utils/upload");

// Get all get involved options (with optional type filter)
router.get("/", asyncHandler(async (req, res) => {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const options = await GetInvolved.find(filter).sort({ createdAt: -1 });
    res.json(options);
}));

// Get single option
router.get("/:id", asyncHandler(async (req, res) => {
    const option = await GetInvolved.findById(req.params.id);
    if (!option) {
        return res.status(404).json({ success: false, message: "Option not found" });
    }
    res.json(option);
}));

// Create option with icon image upload
router.post("/", uploadImage.single("iconImage"), asyncHandler(async (req, res) => {
    // Handle client sending 'category' instead of 'type'
    if (!req.body.type && req.body.category) {
        req.body.type = req.body.category;
    }

    const optionData = {
        ...req.body,

        benefits: req.body.benefits
            ? (typeof req.body.benefits === 'string'
                ? JSON.parse(req.body.benefits)
                : req.body.benefits)
            : [],

        requirements: req.body.requirements
            ? (typeof req.body.requirements === 'string'
                ? JSON.parse(req.body.requirements)
                : req.body.requirements)
            : [],

        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // Icon handling
    if (req.file) {
        optionData.icon = req.file.path;
    }

    const newOption = await GetInvolved.create(optionData);
    res.status(201).json({ success: true, data: newOption });
}));

// Update option
router.put("/:id", uploadImage.single("iconImage"), asyncHandler(async (req, res) => {
    const existingOption = await GetInvolved.findById(req.params.id);
    if (!existingOption) {
        return res.status(404).json({ success: false, message: "Option not found" });
    }

    const updateData = {
        ...req.body,

        benefits: req.body.benefits
            ? (typeof req.body.benefits === 'string'
                ? JSON.parse(req.body.benefits)
                : req.body.benefits)
            : existingOption.benefits,

        requirements: req.body.requirements
            ? (typeof req.body.requirements === 'string'
                ? JSON.parse(req.body.requirements)
                : req.body.requirements)
            : existingOption.requirements,

        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // Icon update
    if (req.file) {
        if (existingOption.icon) {
            deleteFile(existingOption.icon);
        }
        updateData.icon = req.file.path;
    }

    const updatedOption = await GetInvolved.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
    );

    res.json({ success: true, data: updatedOption });
}));

// Delete option
router.delete("/:id", asyncHandler(async (req, res) => {
    const option = await GetInvolved.findById(req.params.id);
    if (!option) {
        return res.status(404).json({ success: false, message: "Option not found" });
    }

    if (option.icon) {
        deleteFile(option.icon);
    }

    await GetInvolved.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Option deleted successfully" });
}));

module.exports = router;

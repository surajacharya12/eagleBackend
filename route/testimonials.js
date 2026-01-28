const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Testimonial = require("../module/testimonial");
const { uploadImage, deleteFile } = require("../utils/upload");

// Get all testimonials
router.get("/", asyncHandler(async (req, res) => {
    const { featured } = req.query;
    const filter = featured === 'true' ? { featured: true } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
}));

// Get single testimonial
router.get("/:id", asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.json(testimonial);
}));

// Create testimonial with image upload
router.post("/", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const testimonialData = {
        ...req.body,
        rating: parseInt(req.body.rating) || 5,
        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // Set image path if file was uploaded
    if (req.file) {
        testimonialData.image = req.file.path;
    }

    const newTestimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ success: true, data: newTestimonial });
}));

// Update testimonial with optional image upload
router.put("/:id", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const existingTestimonial = await Testimonial.findById(req.params.id);
    if (!existingTestimonial) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    const updateData = {
        ...req.body,
        rating: parseInt(req.body.rating) || existingTestimonial.rating,
        featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // If new image uploaded, delete old one and set new path
    if (req.file) {
        if (existingTestimonial.image) {
            deleteFile(existingTestimonial.image);
        }
        updateData.image = req.file.path;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedTestimonial });
}));

// Delete testimonial
router.delete("/:id", asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    // Delete associated image file
    // Delete associated image file
    if (testimonial.image) {
        deleteFile(testimonial.image);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Testimonial deleted successfully" });
}));

module.exports = router;

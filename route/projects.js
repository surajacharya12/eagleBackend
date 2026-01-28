const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Project = require("../module/project");
const { uploadImage, deleteFile } = require("../utils/upload");

// Get all projects (with optional category filter)
router.get("/", asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
}));

// Get single project
router.get("/:id", asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json(project);
}));

// Create project with image upload
router.post("/", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const projectData = {
        ...req.body,
        // Parse arrays if sent as strings
        features: req.body.features ? (typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features) : [],
        techStack: req.body.techStack ? (typeof req.body.techStack === 'string' ? JSON.parse(req.body.techStack) : req.body.techStack) : [],
    };

    // Set image path if file was uploaded
    if (req.file) {
        projectData.image = req.file.path;
    }

    const newProject = await Project.create(projectData);
    res.status(201).json({ success: true, data: newProject });
}));

// Update project with optional image upload
router.put("/:id", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
        return res.status(404).json({ success: false, message: "Project not found" });
    }

    const updateData = {
        ...req.body,
        features: req.body.features ? (typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features) : existingProject.features,
        techStack: req.body.techStack ? (typeof req.body.techStack === 'string' ? JSON.parse(req.body.techStack) : req.body.techStack) : existingProject.techStack,
    };

    // If new image uploaded, delete old one and set new path
    if (req.file) {
        if (existingProject.image) {
            deleteFile(existingProject.image);
        }
        updateData.image = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedProject });
}));

// Delete project
router.delete("/:id", asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete associated image file
    // Delete associated image file
    if (project.image) {
        deleteFile(project.image);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
}));

module.exports = router;

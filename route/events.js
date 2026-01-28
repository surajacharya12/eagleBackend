const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Event = require("../module/event");
const { uploadImage, deleteFile } = require("../utils/upload");

// --- GET ALL EVENTS ---
router.get("/", asyncHandler(async (req, res) => {
    const { type } = req.query;
    const now = new Date();

    // Automatically move expired upcoming events to past
    await Event.updateMany(
        { type: "upcoming", date: { $lt: now } },
        { $set: { type: "past" } }
    );

    const filter = type ? { type } : {};
    const events = await Event.find(filter).sort({ date: type === "past" ? -1 : 1 });
    res.json(events);
}));

// --- GET SINGLE EVENT ---
router.get("/:id", asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Automatically update type if event is in the past
    if (event.type === "upcoming" && event.date < new Date()) {
        event.type = "past";
        await event.save();
    }

    res.json(event);
}));

// --- CREATE EVENT ---
router.post("/", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const eventData = { ...req.body };

    // Convert boolean string
    if (typeof eventData.featured === "string") eventData.featured = eventData.featured === "true";

    // Determine type automatically based on date
    const eventDate = new Date(eventData.date);
    eventData.type = eventDate < new Date() ? "past" : "upcoming";

    if (req.file) eventData.image = `/uploads/images/${req.file.filename}`;

    const newEvent = await Event.create(eventData);
    res.status(201).json({ success: true, data: newEvent });
}));

// --- UPDATE EVENT ---
router.put("/:id", uploadImage.single("image"), asyncHandler(async (req, res) => {
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) return res.status(404).json({ success: false, message: "Event not found" });

    const updateData = { ...req.body };
    if (typeof updateData.featured === "string") updateData.featured = updateData.featured === "true";

    // Determine type automatically based on updated date
    if (updateData.date) {
        const updatedDate = new Date(updateData.date);
        updateData.type = updatedDate < new Date() ? "past" : "upcoming";
    }

    if (req.file) {
        if (existingEvent.image && existingEvent.image.startsWith("/uploads")) deleteFile(existingEvent.image);
        updateData.image = `/uploads/images/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedEvent });
}));

// --- DELETE EVENT ---
router.delete("/:id", asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.image && event.image.startsWith("/uploads")) deleteFile(event.image);

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted successfully" });
}));

module.exports = router;

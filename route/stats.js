const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Stats = require("../module/stats");

// Get stats (only first document)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stats = await Stats.findOne({});
    if (!stats)
      return res.json({
        success: false,
        message: "No stats found",
        data: null,
      });
    res.json({ success: true, data: stats });
  })
);

// Create new stats
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newStats = await Stats.create(req.body);
    res.status(201).json({ success: true, data: newStats });
  })
);

// Update stats by ID
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updatedStats = await Stats.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedStats)
      return res
        .status(404)
        .json({ success: false, message: "Stats not found" });
    res.json({ success: true, data: updatedStats });
  })
);

// Delete stats by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deletedStats = await Stats.findByIdAndDelete(req.params.id);
    if (!deletedStats)
      return res
        .status(404)
        .json({ success: false, message: "Stats not found" });
    res.json({ success: true, message: "Stats deleted successfully" });
  })
);

module.exports = router;

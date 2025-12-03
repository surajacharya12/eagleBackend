// routes/about.js
const express = require("express");
const router = express.Router();
const About = require("../module/About");

// GET all About entries
router.get("/", async (req, res) => {
  try {
    const about = await About.find();
    res.json({ success: true, data: about });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

// POST new About entry
router.post("/", async (req, res) => {
  try {
    const { vision, mission, coreValues, whatWeOffer } = req.body;
    const newAbout = new About({ vision, mission, coreValues, whatWeOffer });
    await newAbout.save();
    res.json({ success: true, data: newAbout });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

// PUT update About by ID
router.put("/:id", async (req, res) => {
  try {
    const { vision, mission, coreValues, whatWeOffer } = req.body;
    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      { vision, mission, coreValues, whatWeOffer },
      { new: true }
    );
    if (!updatedAbout)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updatedAbout });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

// DELETE About by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAbout = await About.findByIdAndDelete(req.params.id);
    if (!deletedAbout)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: deletedAbout });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

module.exports = router;

const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Founder = require("../module/founder");
const { uploadToCloudinary } = require("../config/cloudinary");

// Cloudinary uploader for founder avatar
const founderUpload = uploadToCloudinary("startupBackend/founder");

//CREATE FOUNDER

router.post(
  "/create",
  (req, res, next) => {
    founderUpload.single("avatar")(req, res, (err) => {
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
    const { name, position, quote, details, whatsapp } = req.body;
    let socials = req.body.socials;

    if (typeof socials === "string") {
      try {
        socials = JSON.parse(socials);
      } catch (e) {
        socials = [];
      }
    }

    const newFounder = await Founder.create({
      name,
      position,
      quote,
      details,
      socials,
      whatsapp,
      avatar: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Founder created successfully",
      data: newFounder,
    });
  })
);

//GET FOUNDER  (first founder)

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const founder = await Founder.findOne();
    res.json({ success: true, data: founder });
  })
);

//UPDATE FOUNDER

router.put(
  "/update/:id",
  (req, res, next) => {
    founderUpload.single("avatar")(req, res, (err) => {
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
    const { name, position, quote, details, whatsapp } = req.body;
    let socials = req.body.socials;

    if (typeof socials === "string") {
      try {
        socials = JSON.parse(socials);
      } catch (e) {
        socials = [];
      }
    }

    const updateData = {
      name,
      position,
      quote,
      details,
      socials,
      whatsapp,
    };

    // If a new avatar is uploaded
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const updatedFounder = await Founder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFounder) {
      return res
        .status(404)
        .json({ success: false, message: "Founder not found" });
    }

    res.json({
      success: true,
      message: "Founder updated successfully",
      data: updatedFounder,
    });
  })
);

// DELETE FOUNDER

router.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const deletedFounder = await Founder.findByIdAndDelete(req.params.id);

    if (!deletedFounder) {
      return res
        .status(404)
        .json({ success: false, message: "Founder not found" });
    }

    res.json({
      success: true,
      message: "Founder deleted successfully",
    });
  })
);

module.exports = router;

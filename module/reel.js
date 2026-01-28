const mongoose = require("mongoose");

const ReelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    publicId: { type: String, required: false }, // Useful for deleting from Cloudinary
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Reel || mongoose.model("Reel", ReelSchema);

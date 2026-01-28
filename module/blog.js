const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    publicId: { type: String, required: true }, // Useful for deleting from Cloudinary
    author: { type: String, required: false },
    slug: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: false },
    readTime: { type: String, required: false },
    views: { type: Number, default: 0 },
    type: { type: String, enum: ["standard", "link"], default: "standard" },
    externalUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ["tutorial", "documentation", "tool", "template", "guide"],
        required: true
    },
    link: { type: String, required: true },
    image: { type: String },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", ResourceSchema);

const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: {
        type: String,
        enum: ["sandbox", "incubating", "graduated", "archived"],
        required: true
    },
    version: { type: String, default: "v1.0" },
    maturity: { type: String, default: "0%" },
    contributors: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    features: [{ type: String }],
    techStack: [{ type: String }],
    status: { type: String, default: "Active" },
    roadmap: { type: String },
    license: { type: String, default: "MIT" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);

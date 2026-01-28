const mongoose = require("mongoose");

const ContributorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    contributions: {
        type: Number,
        default: 0,
    },
    github: {
        type: String,
        default: "",
    },
    linkedin: {
        type: String,
        default: "",
    },
    twitter: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.models.Contributors || mongoose.model("Contributors", ContributorsSchema);

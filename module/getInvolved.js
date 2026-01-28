const mongoose = require("mongoose");

const GetInvolvedSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Type of involvement
    type: {
        type: String,
        enum: ["volunteer", "contribute", "careers"], // sponsor removed
        required: true
    },

    // Icon for volunteer & contribute
    icon: { type: String, required: true },

    // Used for volunteer/contribute
    link: { type: String },

    // These fields are for careers only
    department: { type: String },
    location: { type: String },
    jobType: { type: String },
    applyLink: { type: String },

    benefits: [{ type: String }],
    requirements: [{ type: String }],
    featured: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GetInvolved", GetInvolvedSchema);

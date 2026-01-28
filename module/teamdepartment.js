const mongoose = require("mongoose");

// Leadership Schema
const LeadershipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: false },
    bio: { type: String, required: false },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    email: { type: String, default: "" },
});

// Department Schema
const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: Number, required: true },
    icon: { type: String, default: "💼" },
    color: { type: String, required: false },
});

// Main Combined Schema
const TeamDepartmentSchema = new mongoose.Schema({
    leadership: [LeadershipSchema],
    departments: [DepartmentSchema],
});

// Export Model
module.exports = mongoose.models.TeamDepartment ||
    mongoose.model("TeamDepartment", TeamDepartmentSchema);

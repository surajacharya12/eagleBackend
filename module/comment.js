const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

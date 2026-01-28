const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Comment = require("../module/comment");

// GET Comments for a Blog
router.get(
    "/:blogId",
    asyncHandler(async (req, res) => {
        const { blogId } = req.params;
        const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
        res.json({ success: true, data: comments });
    })
);

// ADD Comment
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { blogId, name, email, content } = req.body;
        if (!blogId || !name || !email || !content) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newComment = await Comment.create({
            blogId,
            name,
            email,
            content,
        });

        res.json({ success: true, message: "Comment added successfully", data: newComment });
    })
);

// DELETE Comment
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    })
);

module.exports = router;

const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Blog = require("../module/blog");
const { uploadToCloudinary, cloudinary } = require("../config/cloudinary");
const slugify = require("slugify");
const blogUpload = uploadToCloudinary("startupBackend/blogs");

// GET All Blogs
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, data: blogs });
    })
);

// GET Single Blog by slug
router.get(
    "/:slug",
    asyncHandler(async (req, res) => {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug }); // <-- find by slug
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json({ success: true, data: blog });
    })
);


// ADD Blog
router.post(
    "/",
    (req, res, next) => {
        blogUpload.single("image")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { title, content, author, slug, tags, category, readTime, type, externalUrl } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        if (type === "link" && !externalUrl) {
            return res.status(400).json({ success: false, message: "External URL is required for link type blogs" });
        }

        const newBlog = await Blog.create({
            title,
            content,
            author,
            image: req.file.path,
            publicId: req.file.filename,
            slug: slug || title.toLowerCase().replace(/ /g, "-"),
            tags: tags ? JSON.parse(tags) : [],
            category,
            readTime,
            type: type || "standard",
            externalUrl,
        });

        res.json({ success: true, message: "Blog added successfully", data: newBlog });
    })
);

// UPDATE Blog
router.put(
    "/:id",
    (req, res, next) => {
        blogUpload.single("image")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, content, author, slug, tags, category, readTime, type, externalUrl } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.author = author || blog.author;
        blog.slug = slug || blog.slug;
        blog.tags = tags ? JSON.parse(tags) : blog.tags;
        blog.category = category || blog.category;
        blog.readTime = readTime || blog.readTime;
        blog.type = type || blog.type;
        blog.externalUrl = externalUrl || blog.externalUrl;

        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (blog.publicId) {
                await cloudinary.uploader.destroy(blog.publicId);
            }
            blog.image = req.file.path;
            blog.publicId = req.file.filename;
        }

        await blog.save();
        res.json({ success: true, message: "Blog updated successfully", data: blog });
    })
);

// DELETE Blog
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

        // Delete image from Cloudinary
        if (blog.publicId) {
            await cloudinary.uploader.destroy(blog.publicId);
        }

        await Blog.findByIdAndDelete(id);
        res.json({ success: true, message: "Blog deleted successfully" });
    })
);

module.exports = router;

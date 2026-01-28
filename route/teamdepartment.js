const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const TeamDepartment = require("../module/teamdepartment");
const { uploadToCloudinary } = require("../config/cloudinary");

// Cloudinary uploaders
const leadershipUpload = uploadToCloudinary("startupBackend/leadership");
const departmentUpload = uploadToCloudinary("startupBackend/departments");

// GET TeamDepartment Data (Assuming single document for the page)
router.get(
    "/",
    asyncHandler(async (req, res) => {
        let data = await TeamDepartment.findOne();
        if (!data) {
            // Create default empty document if not exists
            data = await TeamDepartment.create({ leadership: [], departments: [] });
        }
        res.json({ success: true, data });
    })
);

// --- LEADERSHIP MANAGEMENT ---

// Add Leader
router.post(
    "/leadership/add",
    (req, res, next) => {
        leadershipUpload.single("avatar")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { name, role, bio, linkedin, twitter, email } = req.body;

        const newLeader = {
            name,
            role,
            bio,
            linkedin,
            twitter,
            email,
            avatar: req.file ? req.file.path : "",
        };

        const data = await TeamDepartment.findOne();
        if (!data) {
            await TeamDepartment.create({ leadership: [newLeader], departments: [] });
        } else {
            data.leadership.push(newLeader);
            await data.save();
        }

        res.json({ success: true, message: "Leader added successfully", data: newLeader });
    })
);

// Update Leader
router.put(
    "/leadership/update/:id",
    (req, res, next) => {
        leadershipUpload.single("avatar")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, role, bio, linkedin, twitter, email } = req.body;

        const data = await TeamDepartment.findOne();
        if (!data) return res.status(404).json({ success: false, message: "Data not found" });

        const leader = data.leadership.id(id);
        if (!leader) return res.status(404).json({ success: false, message: "Leader not found" });

        leader.name = name || leader.name;
        leader.role = role || leader.role;
        leader.bio = bio || leader.bio;
        leader.linkedin = linkedin || leader.linkedin;
        leader.twitter = twitter || leader.twitter;
        leader.email = email || leader.email;
        if (req.file) leader.avatar = req.file.path;

        await data.save();
        res.json({ success: true, message: "Leader updated successfully", data: leader });
    })
);

// Delete Leader
router.delete(
    "/leadership/delete/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await TeamDepartment.findOne();
        if (!data) return res.status(404).json({ success: false, message: "Data not found" });

        data.leadership.pull(id);
        await data.save();

        res.json({ success: true, message: "Leader deleted successfully" });
    })
);


// --- DEPARTMENT MANAGEMENT ---

// Add Department
router.post(
    "/departments/add",
    (req, res, next) => {
        departmentUpload.single("icon")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { name, members, color, icon } = req.body;

        const newDepartment = {
            name,
            members,
            color,
            icon: req.file ? req.file.path : (icon || "💼"),
        };

        let data = await TeamDepartment.findOne();
        if (!data) {
            data = await TeamDepartment.create({ leadership: [], departments: [newDepartment] });
        } else {
            data.departments.push(newDepartment);
            await data.save();
        }

        res.json({ success: true, message: "Department added successfully", data: newDepartment });
    })
);

// Update Department
router.put(
    "/departments/update/:id",
    (req, res, next) => {
        departmentUpload.single("icon")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, members, color, icon } = req.body;

        const data = await TeamDepartment.findOne();
        if (!data) return res.status(404).json({ success: false, message: "Data not found" });

        const department = data.departments.id(id);
        if (!department) return res.status(404).json({ success: false, message: "Department not found" });

        department.name = name || department.name;
        department.members = members || department.members;
        department.color = color || department.color;
        if (req.file) {
            department.icon = req.file.path;
        } else if (icon) {
            department.icon = icon;
        }

        await data.save();
        res.json({ success: true, message: "Department updated successfully", data: department });
    })
);

// Delete Department
router.delete(
    "/departments/delete/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await TeamDepartment.findOne();
        if (!data) return res.status(404).json({ success: false, message: "Data not found" });

        data.departments.pull(id);
        await data.save();

        res.json({ success: true, message: "Department deleted successfully" });
    })
);

module.exports = router;

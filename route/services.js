const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Service = require("../module/services");

router.get("/", asyncHandler(async (req, res) => {
    const services = await Service.find();
    res.json(services);
}));

router.post("/", asyncHandler(async (req, res) => {
    const newService = await Service.create(req.body);
    res.status(201).json({ success: true, data: newService });
}));


router.put("/:id", asyncHandler(async (req, res) => {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!updatedService)
        return res
            .status(404)
            .json({ success: false, message: "Service not found" });
    res.json({ success: true, data: updatedService });
}));


router.delete("/:id", asyncHandler(async (req, res) => {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService)
        return res
            .status(404)
            .json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted successfully" });
}));

module.exports = router;

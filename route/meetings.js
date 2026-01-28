const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { MeetingSlot, Booking } = require("../module/meetingSlot");




// ================== SLOT MANAGEMENT =================


// Admin: Create slot
router.post("/slots", asyncHandler(async (req, res) => {
    const newSlot = await MeetingSlot.create(req.body);
    res.status(201).json({ success: true, data: newSlot });
}));

// Admin: Bulk slot creation
router.post("/slots/bulk", asyncHandler(async (req, res) => {
    const { startDate, endDate, startTime, endTime, duration, excludeWeekends } = req.body;

    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const slotDuration = duration || 30;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) continue;

        let h = startH;
        let m = startM;

        while (h < endH || (h === endH && m < endM)) {
            const startT = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

            let endMin = m + slotDuration;
            let endHour = h;

            if (endMin >= 60) {
                endHour += Math.floor(endMin / 60);
                endMin %= 60;
            }

            const endT = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

            slots.push({
                date: new Date(date),
                startTime: startT,
                endTime: endT,
                duration: slotDuration
            });

            m += slotDuration;
            if (m >= 60) {
                h += Math.floor(m / 60);
                m %= 60;
            }
        }
    }

    const createdSlots = await MeetingSlot.insertMany(slots);
    res.status(201).json({ success: true, count: createdSlots.length, data: createdSlots });
}));

// Get slots (public or admin)
router.get("/slots", asyncHandler(async (req, res) => {
    const { date, available } = req.query;

    const filter = {};

    if (date) {
        const d1 = new Date(date);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date(date);
        d2.setHours(23, 59, 59, 999);

        filter.date = { $gte: d1, $lte: d2 };
    }

    if (available === "true") {
        filter.$expr = { $lt: ["$currentBookings", "$maxBookings"] };
        filter.isAvailable = true;
    }

    const slots = await MeetingSlot.find(filter).sort({ date: 1, startTime: 1 });
    res.json(slots);
}));

// Update slot
router.put("/slots/:id", asyncHandler(async (req, res) => {
    const updated = await MeetingSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Slot not found" });
    res.json({ success: true, data: updated });
}));

// Delete slot
router.delete("/slots/:id", asyncHandler(async (req, res) => {
    const deleted = await MeetingSlot.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Slot not found" });
    res.json({ success: true, message: "Slot deleted" });
}));




// =================== BOOKING SYSTEM =================


// User: Book a slot
router.post("/book", asyncHandler(async (req, res) => {
    const { slotId, name, email, phone, address, purpose } = req.body;

    const slot = await MeetingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.currentBookings >= slot.maxBookings)
        return res.status(400).json({ message: "Slot is full" });

    // Create booking
    const booking = await Booking.create({
        slotId,
        name,
        email,
        phone,
        address,
        purpose
    });

    slot.currentBookings++;
    if (slot.currentBookings >= slot.maxBookings) slot.isAvailable = false;
    await slot.save();

    const populated = await Booking.findById(booking._id).populate("slotId");

    res.status(201).json({
        success: true,
        data: populated,
        bookingCode: booking.bookingCode
    });
}));

// Admin: All bookings
router.get("/bookings", asyncHandler(async (req, res) => {
    const bookings = await Booking.find().populate("slotId").sort({ createdAt: -1 });
    res.json(bookings);
}));

// User: Get booking by code
router.get("/bookings/code/:code", asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ bookingCode: req.params.code }).populate("slotId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
}));

// Admin: Update booking status
router.put("/bookings/:id/status", asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const oldStatus = booking.status;
    booking.status = req.body.status;
    await booking.save();

    // Auto free slot if booking cancelled
    if (req.body.status === "cancelled" && oldStatus !== "cancelled") {
        const slot = await MeetingSlot.findById(booking.slotId);
        if (slot) {
            slot.currentBookings = Math.max(0, slot.currentBookings - 1);
            slot.isAvailable = true;
            await slot.save();
        }
    }

    const populated = await Booking.findById(booking._id).populate("slotId");
    res.json({ success: true, data: populated });
}));

// User: Cancel booking by code
router.put("/bookings/cancel/:code", asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ bookingCode: req.params.code });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled")
        return res.status(400).json({ message: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    const slot = await MeetingSlot.findById(booking.slotId);
    if (slot) {
        slot.currentBookings = Math.max(0, slot.currentBookings - 1);
        slot.isAvailable = true;
        await slot.save();
    }

    const populated = await Booking.findById(booking._id).populate("slotId");
    res.json({ success: true, data: populated });
}));



module.exports = router;

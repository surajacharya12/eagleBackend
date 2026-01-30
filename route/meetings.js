const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { MeetingSlot, Booking } = require("../module/meetingSlot");
const sendEmail = require("../utils/email");

const sendBookingEmail = async (booking, statusType) => {
    const isPending = statusType === "pending";
    const subject = isPending
        ? `Booking Received - ${booking.bookingCode}`
        : `Booking Update: ${statusType.toUpperCase()} - ${booking.bookingCode}`;

    const statusLabel = statusType.toUpperCase();
    const isCancelled = statusType === "cancelled";
    const statusColor = isCancelled ? "#ef4444" : (statusType === "confirmed" ? "#10b981" : "#f59e0b");

    const message = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                .header { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 40px 20px; text-align: center; color: white; }
                .body { padding: 40px 30px; line-height: 1.6; color: #374151; }
                .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 20px; color: white; background-color: ${statusColor}; }
                .details-card { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 25px; margin: 25px 0; }
                .detail-row { display: flex; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
                .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                .label { font-size: 13px; color: #64748b; font-weight: 500; min-width: 120px; }
                .value { font-size: 14px; color: #1e293b; font-weight: 600; }
                .footer { background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                h1 { margin: 0; font-size: 28px; letter-spacing: -0.025em; }
                p { margin: 10px 0; }
                .code { font-family: monospace; color: #2563eb; font-size: 18px; letter-spacing: 2px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <p style="text-transform: uppercase; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 10px; opacity: 0.9;">Eagle Infotech</p>
                    <h1>${isPending ? "Booking Received" : "Booking Updated"}</h1>
                </div>
                <div class="body">
                    <div class="status-badge">${statusLabel}</div>
                    <p style="font-size: 18px; color: #111827;">Hello <strong>${booking.name}</strong>,</p>
                    <p>${isPending ? "Thank you for reaching out to us. We've successfully received your booking request. Our team will review it shortly." : `Your booking with Eagle Infotech has been updated to <strong>${statusLabel}</strong>.`}</p>
                    
                    <div class="details-card">
                        <div class="detail-row">
                            <div class="label">Booking Code</div>
                            <div class="value code">${booking.bookingCode}</div>
                        </div>
                        <div class="detail-row">
                            <div class="label">Scheduled Date</div>
                            <div class="value">${new Date(booking.slotId.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div class="detail-row">
                            <div class="label">Time Slot</div>
                            <div class="value">${booking.slotId.startTime} - ${booking.slotId.endTime}</div>
                        </div>
                        <div class="detail-row">
                            <div class="label">Purpose</div>
                            <div class="value">${booking.purpose}</div>
                        </div>
                    </div>

                    <p>You can track the status or reschedule your meeting by visiting our tracking portal using your unique booking code.</p>
                    
                    <a href="https://eagle-web-gamma.vercel.app/book-meeting/track/" class="button">Track My Booking</a>
                    
                </div>
                <div class="footer">
                    <p style="font-weight: 600; color: #475569; margin-bottom: 5px;">Eagle Infotech - Innovation & Technology Solutions</p>
                    <p style="font-size: 12px; color: #94a3b8;">This is an automated notification. Please do not reply to this email.</p>
                    <div style="margin-top: 15px;">
                        <span style="font-size: 12px; color: #cbd5e1;">© ${new Date().getFullYear()} Eagle Infotech. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await sendEmail({
            email: booking.email,
            subject,
            message
        });
    } catch (err) {
        console.error("Email sending failed:", err);
    }
};





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

    // Send Pending Email
    await sendBookingEmail(populated, "pending");

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

// User: Get all bookings by email
router.get("/bookings/user/:email", asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ email: req.params.email }).populate("slotId").sort({ createdAt: -1 });
    res.json(bookings);
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
    // Send Status Update Email
    await sendBookingEmail(populated, req.body.status);

    // If cancelled, remove immediately after notifying
    if (req.body.status === "cancelled") {
        await Booking.findByIdAndDelete(booking._id);
    }

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

    // Send Cancellation Email
    await sendBookingEmail(populated, "cancelled");

    // Delete record immediately
    await Booking.findByIdAndDelete(booking._id);

    res.json({ success: true, message: "Booking cancelled and removed from database" });
}));

const cleanupOldBookings = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const oldSlots = await MeetingSlot.find({ date: { $lt: oneWeekAgo } });
        const oldSlotIds = oldSlots.map(s => s._id);

        if (oldSlotIds.length > 0) {
            // Delete bookings associated with these slots first
            const bookingResult = await Booking.deleteMany({ slotId: { $in: oldSlotIds } });

            // Delete the slots themselves to free space
            const slotResult = await MeetingSlot.deleteMany({ _id: { $in: oldSlotIds } });

            console.log(`🚀 Cleanup: Removed ${bookingResult.deletedCount} bookings and ${slotResult.deletedCount} old time slots.`);
        }
    } catch (err) {
        console.error("Cleanup error:", err);
    }
};

// Background cleanup: Remove finished meetings after 1 week
// Runs every 24 hours
setInterval(cleanupOldBookings, 24 * 60 * 60 * 1000);
// Also run once on startup
cleanupOldBookings();



module.exports = router;

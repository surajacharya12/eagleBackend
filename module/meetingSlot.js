const mongoose = require("mongoose");

// =============== MEETING SLOT MODEL ===============
const MeetingSlotSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true },
    duration: { type: Number, default: 30 },
    isAvailable: { type: Boolean, default: true },
    maxBookings: { type: Number, default: 1 },
    currentBookings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

MeetingSlotSchema.index({ date: 1, startTime: 1 });

// =============== BOOKING MODEL ===============
const BookingSchema = new mongoose.Schema({
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "MeetingSlot", required: true },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    purpose: { type: String, required: true },

    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

    bookingCode: {
        type: String,
        default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    MeetingSlot: mongoose.model("MeetingSlot", MeetingSlotSchema),
    Booking: mongoose.model("Booking", BookingSchema)
};

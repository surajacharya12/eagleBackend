const mongoose = require("mongoose");
const crypto = require("crypto");

const BookingSchema = new mongoose.Schema({
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MeetingSlot",
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    purpose: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    bookingCode: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Generate unique booking code before saving
BookingSchema.pre("save", function (next) {
    if (!this.bookingCode) {
        this.bookingCode = "MTG-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    }
    next();
});

module.exports = mongoose.model("Booking", BookingSchema);

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    attendees: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: {
        type: String,
        enum: ["Conference", "Workshop", "Webinar", "Meetup", "Hackathon"],
        default: "Meetup"
    },
    featured: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ["upcoming", "past"],
        required: true
    },
    registrationLink: { type: String }, // for upcoming events
    recordingLink: { type: String },    // for past events
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);

const mongoose = require("mongoose");

const founderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    trim: true,
  },
  quote: {
    type: String,
    required: [true, "Quote is required"],
    trim: true,
  },
  details: {
    type: String,
    required: [true, "Details are required"],
    trim: true,
  },

  // Social Media Links (LinkedIn, Twitter, Email)
  // Social Media Links
  socials: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  whatsapp: {
    type: String,
    trim: true,
  },

  // OPTIONAL: profile image
  avatar: {
    type: String,
    default: "", // You can store image URL here
  },
});

module.exports = mongoose.model("Founder", founderSchema);

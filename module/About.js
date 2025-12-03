// module/About.js
const mongoose = require("mongoose");

const CoreValueSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  bg: { type: String, required: true },
});

const OfferItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const OfferCategorySchema = new mongoose.Schema({
  section: { type: String, required: true }, // e.g., "Services-Based Solutions"
  items: [OfferItemSchema],
});

const AboutSchema = new mongoose.Schema(
  {
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    coreValues: [CoreValueSchema],
    whatWeOffer: [OfferCategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.About || mongoose.model("About", AboutSchema);

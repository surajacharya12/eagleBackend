const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  ProjectComplete: { type: Number, required: true },
  HappyClient: { type: Number, required: true },
  ClientSatisfaction: { type: Number, required: true },
  Experience: { type: Number, required: true },
  Support: { type: String, required: true, default: "24/7" },
});

module.exports = mongoose.model("Stats", statsSchema);

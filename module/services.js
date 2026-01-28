const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    bg: { type: String, required: true },
});


module.exports = mongoose.model("Service", ServiceSchema);

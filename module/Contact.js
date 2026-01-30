const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        whatsapp: { type: String },
        socials: [
            {
                platform: { type: String, required: true },
                url: { type: String, required: true },
                icon: { type: String },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);

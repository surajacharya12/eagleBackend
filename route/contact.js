const express = require("express");
const router = express.Router();
const Contact = require("../module/Contact");

// GET Contact info (assuming single document)
router.get("/", async (req, res) => {
    try {
        const contact = await Contact.findOne();
        // If no contact exists, return null data but success true
        res.json({ success: true, data: contact });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

// POST/PUT (Upsert) Contact info
router.post("/", async (req, res) => {
    try {
        const { address, email, phone, whatsapp, socials } = req.body;

        // Check if a contact document already exists
        let contact = await Contact.findOne();

        if (contact) {
            // Update existing
            contact.address = address;
            contact.email = email;
            contact.phone = phone;
            contact.whatsapp = whatsapp;
            contact.socials = socials;
            await contact.save();
        } else {
            // Create new
            contact = new Contact({ address, email, phone, whatsapp, socials });
            await contact.save();
        }

        res.json({ success: true, data: contact });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

module.exports = router;

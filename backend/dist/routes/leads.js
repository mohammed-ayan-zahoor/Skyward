"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Lead_1 = require("../models/Lead");
const router = (0, express_1.Router)();
// POST /api/leads
// Public route to submit the contact/quote form
router.post('/', async (req, res) => {
    const { name, phone, email, message } = req.body;
    // Simple input validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ error: 'Valid email is required' });
        return;
    }
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
        res.status(400).json({ error: 'Phone number is required' });
        return;
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
        res.status(400).json({ error: 'Message is required' });
        return;
    }
    try {
        const newLead = await Lead_1.Lead.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message.trim(),
        });
        res.status(201).json({
            message: 'Inquiry submitted successfully',
            lead: {
                id: newLead._id.toString(),
                name: newLead.name,
                submittedAt: newLead.submittedAt,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save inquiry' });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Installation_1 = require("../models/Installation");
const router = (0, express_1.Router)();
// GET /api/installations
// Query params: ?featured=true | ?location=Bengaluru | ?type=Cantilever
router.get('/', async (req, res) => {
    const { featured, location, type } = req.query;
    try {
        const filter = { status: 'published' };
        if (featured === 'true')
            filter.isFeatured = true;
        if (location)
            filter.location = new RegExp(location, 'i');
        if (type)
            filter.canopyType = new RegExp(type, 'i');
        const rawInstallations = await Installation_1.Installation.find(filter)
            .sort({ isFeatured: -1, yearCompleted: -1 })
            .lean();
        const installations = rawInstallations.map((inst) => {
            const coverPhoto = inst.photos?.find((p) => p.isCover) || inst.photos?.[0];
            return {
                id: inst._id.toString(),
                title: inst.title,
                slug: inst.slug,
                location: inst.location,
                canopyType: inst.canopyType,
                yearCompleted: inst.yearCompleted,
                description: inst.description,
                isFeatured: inst.isFeatured,
                brand: inst.brand,
                coverImageId: inst.coverImageId,
                photos: coverPhoto ? [{ imageUrl: coverPhoto.imageUrl, caption: coverPhoto.caption }] : [],
            };
        });
        res.json(installations);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch installations' });
    }
});
// GET /api/installations/:slug
// Returns a single installation with all its photos ordered by sortOrder
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const installation = await Installation_1.Installation.findOne({ slug, status: 'published' }).lean();
        if (!installation) {
            res.status(404).json({ error: 'Installation not found' });
            return;
        }
        const photos = (installation.photos || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        res.json({
            ...installation,
            id: installation._id.toString(),
            photos: photos.map((p) => ({
                id: p._id.toString(),
                imageUrl: p.imageUrl,
                caption: p.caption,
                sortOrder: p.sortOrder,
                isCover: p.isCover,
            })),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch installation' });
    }
});
exports.default = router;

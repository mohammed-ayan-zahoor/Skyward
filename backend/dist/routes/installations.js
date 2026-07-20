"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/installations
// Query params: ?featured=true | ?location=Bengaluru | ?type=Cantilever
router.get('/', async (req, res) => {
    const { featured, location, type } = req.query;
    try {
        const installations = await db_1.default.installation.findMany({
            where: {
                status: 'published',
                ...(featured === 'true' && { isFeatured: true }),
                ...(location && { location: { equals: location, mode: 'insensitive' } }),
                ...(type && { canopyType: { equals: type, mode: 'insensitive' } }),
            },
            select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                canopyType: true,
                yearCompleted: true,
                isFeatured: true,
                coverImageId: true,
                // Attach only the cover photo so the gallery grid doesn't load every image
                photos: {
                    where: { isCover: true },
                    select: { imageUrl: true, caption: true },
                    take: 1,
                },
            },
            orderBy: [
                { isFeatured: 'desc' }, // featured installations bubble to top
                { yearCompleted: 'desc' },
            ],
        });
        res.json(installations);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch installations' });
    }
});
// GET /api/installations/:slug
// Returns a single installation with all its photos ordered by sort_order
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const installation = await db_1.default.installation.findUnique({
            where: { slug, status: 'published' },
            include: {
                photos: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!installation) {
            res.status(404).json({ error: 'Installation not found' });
            return;
        }
        res.json(installation);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch installation' });
    }
});
exports.default = router;

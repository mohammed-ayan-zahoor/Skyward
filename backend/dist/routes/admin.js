"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// Protect all routes in this router with admin authentication
router.use(auth_1.requireAdmin);
/**
 * ==========================================
 * INSTALLATION CRUD
 * ==========================================
 */
// GET /api/admin/installations
// List ALL installations (both published and drafts)
router.get('/installations', async (req, res) => {
    try {
        const installations = await db_1.default.installation.findMany({
            include: {
                photos: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(installations);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve installations' });
    }
});
// POST /api/admin/installations
// Create a new installation (starts as draft by default)
router.post('/installations', async (req, res) => {
    const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status } = req.body;
    if (!title || !slug || !location || !canopyType || !yearCompleted || !description) {
        res.status(400).json({ error: 'Missing required installation fields' });
        return;
    }
    try {
        const existing = await db_1.default.installation.findUnique({ where: { slug } });
        if (existing) {
            res.status(400).json({ error: 'An installation with this slug already exists' });
            return;
        }
        const installation = await db_1.default.installation.create({
            data: {
                title,
                slug: slug.toLowerCase().trim(),
                location,
                canopyType,
                yearCompleted: Number(yearCompleted),
                description,
                isFeatured: Boolean(isFeatured),
                status: status || 'draft',
            },
        });
        res.status(201).json(installation);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create installation' });
    }
});
// PUT /api/admin/installations/:id
// Update installation details
router.put('/installations/:id', async (req, res) => {
    const id = req.params.id;
    const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status, coverImageId } = req.body;
    try {
        const existing = await db_1.default.installation.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Installation not found' });
            return;
        }
        if (slug && slug !== existing.slug) {
            const slugConflict = await db_1.default.installation.findUnique({ where: { slug } });
            if (slugConflict) {
                res.status(400).json({ error: 'An installation with this slug already exists' });
                return;
            }
        }
        const updated = await db_1.default.installation.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(slug && { slug: slug.toLowerCase().trim() }),
                ...(location && { location }),
                ...(canopyType && { canopyType }),
                ...(yearCompleted && { yearCompleted: Number(yearCompleted) }),
                ...(description && { description }),
                ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
                ...(status && { status }),
                ...(coverImageId !== undefined && { coverImageId }),
            },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update installation' });
    }
});
// DELETE /api/admin/installations/:id
// Deletes installation (cascade deletes all related photos in db)
router.delete('/installations/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const existing = await db_1.default.installation.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Installation not found' });
            return;
        }
        await db_1.default.installation.delete({ where: { id } });
        res.json({ message: 'Installation deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete installation' });
    }
});
/**
 * ==========================================
 * PHOTO MANAGEMENT
 * ==========================================
 */
// POST /api/admin/installations/:id/photos
// Add a photo reference to an installation
router.post('/installations/:id/photos', async (req, res) => {
    const id = req.params.id; // installationId
    const { imageUrl, caption, sortOrder, isCover } = req.body;
    if (!imageUrl) {
        res.status(400).json({ error: 'Image URL is required' });
        return;
    }
    try {
        const inst = await db_1.default.installation.findUnique({ where: { id } });
        if (!inst) {
            res.status(404).json({ error: 'Installation not found' });
            return;
        }
        // If isCover is true, set all other photos of this installation to false
        if (isCover) {
            await db_1.default.photo.updateMany({
                where: { installationId: id },
                data: { isCover: false },
            });
        }
        const photo = await db_1.default.photo.create({
            data: {
                installationId: id,
                imageUrl,
                caption,
                sortOrder: Number(sortOrder || 0),
                isCover: Boolean(isCover),
            },
        });
        // If this is the first photo or marked as cover, auto-update installation coverImageId
        if (isCover || !inst.coverImageId) {
            await db_1.default.installation.update({
                where: { id },
                data: { coverImageId: photo.id },
            });
        }
        res.status(201).json(photo);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add photo' });
    }
});
// DELETE /api/admin/photos/:id
// Remove a photo from an installation
router.delete('/photos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const photo = await db_1.default.photo.findUnique({ where: { id } });
        if (!photo) {
            res.status(404).json({ error: 'Photo not found' });
            return;
        }
        await db_1.default.photo.delete({ where: { id } });
        // If we deleted the cover photo, unset coverImageId on installation or pick the next one
        const inst = await db_1.default.installation.findUnique({
            where: { id: photo.installationId },
            include: { photos: true },
        });
        if (inst && inst.coverImageId === id) {
            const nextCover = inst.photos[0]; // pick first available
            if (nextCover) {
                await db_1.default.photo.update({
                    where: { id: nextCover.id },
                    data: { isCover: true },
                });
                await db_1.default.installation.update({
                    where: { id: inst.id },
                    data: { coverImageId: nextCover.id },
                });
            }
            else {
                await db_1.default.installation.update({
                    where: { id: inst.id },
                    data: { coverImageId: null },
                });
            }
        }
        res.json({ message: 'Photo deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});
/**
 * ==========================================
 * LEADS MANAGEMENT
 * ==========================================
 */
// GET /api/admin/leads
// List all leads/inquiries
router.get('/leads', async (req, res) => {
    try {
        const leads = await db_1.default.lead.findMany({
            orderBy: { submittedAt: 'desc' },
        });
        res.json(leads);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve inquiries' });
    }
});
// PATCH /api/admin/leads/:id
// Update status of an inquiry (e.g. mark as contacted, closed)
router.patch('/leads/:id', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status || !['new', 'contacted', 'closed'].includes(status)) {
        res.status(400).json({ error: 'Invalid or missing status value' });
        return;
    }
    try {
        const updated = await db_1.default.lead.update({
            where: { id },
            data: { status },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update inquiry status' });
    }
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../db"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Configure storage destination dynamically based on installationId
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const id = req.params.id; // installationId passed in URL parameter
        const uploadDir = path_1.default.join(__dirname, '../../uploads/installations', id);
        // Ensure upload directory exists on disk
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate clean filename using timestamp and extension
        const ext = path_1.default.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `photo-${uniqueSuffix}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        ;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed.'));
    }
});
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
// POST /api/admin/installations/:id/upload
// Upload an image file for an installation, save it on disk, and create db photo reference
router.post('/installations/:id/upload', (req, res) => {
    const id = req.params.id;
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            res.status(400).json({ error: err.message || 'File upload failed' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        try {
            const inst = await db_1.default.installation.findUnique({ where: { id } });
            if (!inst) {
                res.status(404).json({ error: 'Installation not found' });
                return;
            }
            // Generate the public web path
            const imageUrl = `/uploads/installations/${id}/${req.file.filename}`;
            // Check if this is the first photo of the installation (so we make it the cover by default)
            const photoCount = await db_1.default.photo.count({ where: { installationId: id } });
            const isCover = photoCount === 0;
            const photo = await db_1.default.photo.create({
                data: {
                    installationId: id,
                    imageUrl,
                    isCover,
                    sortOrder: photoCount,
                }
            });
            // Update coverImageId on installation if this is the cover photo
            if (isCover) {
                await db_1.default.installation.update({
                    where: { id },
                    data: { coverImageId: photo.id }
                });
            }
            res.status(201).json(photo);
        }
        catch (dbErr) {
            console.error(dbErr);
            res.status(500).json({ error: 'Failed to save photo metadata in database' });
        }
    });
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
// DELETE /api/admin/leads/:id
// Delete an inquiry lead permanently
router.delete('/leads/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const existing = await db_1.default.lead.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Inquiry not found' });
            return;
        }
        await db_1.default.lead.delete({ where: { id } });
        res.json({ message: 'Inquiry deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});
exports.default = router;

import { Router, Response } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { Installation } from '../models/Installation';
import { Lead } from '../models/Lead';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure storage destination dynamically based on installationId
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = req.params.id as string;
    const uploadDir = path.join(__dirname, '../../uploads/installations', id);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed.'));
  },
});

// Protect all routes in this router with admin authentication
router.use(requireAdmin);

/**
 * ==========================================
 * INSTALLATION CRUD
 * ==========================================
 */

// GET /api/admin/installations
// List ALL installations (both published and drafts)
router.get('/installations', async (req: AuthRequest, res: Response) => {
  try {
    const rawInstallations = await Installation.find().sort({ createdAt: -1 }).lean();
    const installations = rawInstallations.map((inst: any) => ({
      ...inst,
      id: inst._id.toString(),
      photos: (inst.photos || []).map((p: any) => ({
        id: p._id.toString(),
        imageUrl: p.imageUrl,
        caption: p.caption,
        sortOrder: p.sortOrder,
        isCover: p.isCover,
      })),
    }));
    res.json(installations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve installations' });
  }
});

// POST /api/admin/installations
// Create a new installation (starts as draft by default)
router.post('/installations', async (req: AuthRequest, res: Response) => {
  const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status, brand } = req.body;

  if (!title || !slug || !location || !canopyType || !yearCompleted || !description) {
    res.status(400).json({ error: 'Missing required installation fields' });
    return;
  }

  try {
    const cleanSlug = slug.toLowerCase().trim();
    const existing = await Installation.findOne({ slug: cleanSlug });
    if (existing) {
      res.status(400).json({ error: 'An installation with this slug already exists' });
      return;
    }

    const installation = await Installation.create({
      title,
      slug: cleanSlug,
      location,
      canopyType,
      yearCompleted: Number(yearCompleted),
      description,
      isFeatured: Boolean(isFeatured),
      status: status || 'draft',
      brand: brand || null,
      photos: [],
    });

    res.status(201).json(installation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create installation' });
  }
});

// PUT /api/admin/installations/:id
// Update installation details
router.put('/installations/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status, coverImageId, brand } = req.body;

  try {
    const inst = await Installation.findById(id);
    if (!inst) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    if (slug) {
      const cleanSlug = slug.toLowerCase().trim();
      if (cleanSlug !== inst.slug) {
        const slugConflict = await Installation.findOne({ slug: cleanSlug });
        if (slugConflict) {
          res.status(400).json({ error: 'An installation with this slug already exists' });
          return;
        }
        inst.slug = cleanSlug;
      }
    }

    if (title !== undefined) inst.title = title;
    if (location !== undefined) inst.location = location;
    if (canopyType !== undefined) inst.canopyType = canopyType;
    if (yearCompleted !== undefined) inst.yearCompleted = Number(yearCompleted);
    if (description !== undefined) inst.description = description;
    if (isFeatured !== undefined) inst.isFeatured = Boolean(isFeatured);
    if (status !== undefined) inst.status = status;
    if (coverImageId !== undefined) inst.coverImageId = coverImageId;
    if (brand !== undefined) inst.brand = brand;

    await inst.save();
    res.json(inst);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update installation' });
  }
});

// DELETE /api/admin/installations/:id
// Deletes installation
router.delete('/installations/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    const existing = await Installation.findById(id);
    if (!existing) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    await Installation.findByIdAndDelete(id);
    res.json({ message: 'Installation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete installation' });
  }
});

// POST /api/admin/installations/:id/upload
// Upload an image file for an installation, save it on disk, and add photo reference
router.post('/installations/:id/upload', (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

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
      const inst = await Installation.findById(id);
      if (!inst) {
        res.status(404).json({ error: 'Installation not found' });
        return;
      }

      const imageUrl = `/uploads/installations/${id}/${req.file.filename}`;
      const isCover = inst.photos.length === 0;

      const newPhoto = {
        imageUrl,
        isCover,
        sortOrder: inst.photos.length,
      };

      inst.photos.push(newPhoto as any);
      const addedPhoto = inst.photos[inst.photos.length - 1];

      if (isCover) {
        inst.coverImageId = (addedPhoto as any)._id.toString();
      }

      await inst.save();

      res.status(201).json({
        id: (addedPhoto as any)._id.toString(),
        imageUrl: addedPhoto.imageUrl,
        isCover: addedPhoto.isCover,
        sortOrder: addedPhoto.sortOrder,
      });
    } catch (dbErr) {
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
router.post('/installations/:id/photos', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { imageUrl, caption, sortOrder, isCover } = req.body;

  if (!imageUrl) {
    res.status(400).json({ error: 'Image URL is required' });
    return;
  }

  try {
    const inst = await Installation.findById(id);
    if (!inst) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    if (isCover) {
      inst.photos.forEach((p) => { p.isCover = false; });
    }

    const newPhoto = {
      imageUrl,
      caption,
      sortOrder: Number(sortOrder || 0),
      isCover: Boolean(isCover),
    };

    inst.photos.push(newPhoto as any);
    const addedPhoto = inst.photos[inst.photos.length - 1];
    const photoId = (addedPhoto as any)._id.toString();

    if (isCover || !inst.coverImageId) {
      inst.coverImageId = photoId;
    }

    await inst.save();

    res.status(201).json({
      id: photoId,
      imageUrl: addedPhoto.imageUrl,
      caption: addedPhoto.caption,
      sortOrder: addedPhoto.sortOrder,
      isCover: addedPhoto.isCover,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// DELETE /api/admin/photos/:id
router.delete('/photos/:id', async (req: AuthRequest, res: Response) => {
  const photoId = req.params.id as string;

  try {
    const inst = await Installation.findOne({ 'photos._id': photoId });
    if (!inst) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    inst.photos = inst.photos.filter((p: any) => p._id.toString() !== photoId) as any;

    if (inst.coverImageId === photoId) {
      if (inst.photos.length > 0) {
        inst.photos[0].isCover = true;
        inst.coverImageId = (inst.photos[0] as any)._id.toString();
      } else {
        inst.coverImageId = undefined;
      }
    }

    await inst.save();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
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
router.get('/leads', async (req: AuthRequest, res: Response) => {
  try {
    const rawLeads = await Lead.find().sort({ submittedAt: -1 }).lean();
    const leads = rawLeads.map((l: any) => ({
      ...l,
      id: l._id.toString(),
    }));
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

// PATCH /api/admin/leads/:id
router.patch('/leads/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  if (!status || !['new', 'contacted', 'closed'].includes(status)) {
    res.status(400).json({ error: 'Invalid or missing status value' });
    return;
  }

  try {
    const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;

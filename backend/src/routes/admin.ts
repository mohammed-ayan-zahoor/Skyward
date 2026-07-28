import { Router, Response } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure storage destination dynamically based on installationId
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = req.params.id as string; // installationId passed in URL parameter
    const uploadDir = path.join(__dirname, '../../uploads/installations', id);
    
    // Ensure upload directory exists on disk
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate clean filename using timestamp and extension
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed.'));
  }
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
    const installations = await prisma.installation.findMany({
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(installations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve installations' });
  }
});

// POST /api/admin/installations
// Create a new installation (starts as draft by default)
router.post('/installations', async (req: AuthRequest, res: Response) => {
  const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status } = req.body;

  if (!title || !slug || !location || !canopyType || !yearCompleted || !description) {
    res.status(400).json({ error: 'Missing required installation fields' });
    return;
  }

  try {
    const existing = await prisma.installation.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ error: 'An installation with this slug already exists' });
      return;
    }

    const installation = await prisma.installation.create({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create installation' });
  }
});

// PUT /api/admin/installations/:id
// Update installation details
router.put('/installations/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, slug, location, canopyType, yearCompleted, description, isFeatured, status, coverImageId } = req.body;

  try {
    const existing = await prisma.installation.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.installation.findUnique({ where: { slug } });
      if (slugConflict) {
        res.status(400).json({ error: 'An installation with this slug already exists' });
        return;
      }
    }

    const updated = await prisma.installation.update({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update installation' });
  }
});

// DELETE /api/admin/installations/:id
// Deletes installation (cascade deletes all related photos in db)
router.delete('/installations/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    const existing = await prisma.installation.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    await prisma.installation.delete({ where: { id } });
    res.json({ message: 'Installation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete installation' });
  }
});

// POST /api/admin/installations/:id/upload
// Upload an image file for an installation, save it on disk, and create db photo reference
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
      const inst = await prisma.installation.findUnique({ where: { id } });
      if (!inst) {
        res.status(404).json({ error: 'Installation not found' });
        return;
      }

      // Generate the public web path
      const imageUrl = `/uploads/installations/${id}/${req.file.filename}`;

      // Check if this is the first photo of the installation (so we make it the cover by default)
      const photoCount = await prisma.photo.count({ where: { installationId: id } });
      const isCover = photoCount === 0;

      const photo = await prisma.photo.create({
        data: {
          installationId: id,
          imageUrl,
          isCover,
          sortOrder: photoCount,
        }
      });

      // Update coverImageId on installation if this is the cover photo
      if (isCover) {
        await prisma.installation.update({
          where: { id },
          data: { coverImageId: photo.id }
        });
      }

      res.status(201).json(photo);
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
// Add a photo reference to an installation
router.post('/installations/:id/photos', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string; // installationId
  const { imageUrl, caption, sortOrder, isCover } = req.body;

  if (!imageUrl) {
    res.status(400).json({ error: 'Image URL is required' });
    return;
  }

  try {
    const inst = await prisma.installation.findUnique({ where: { id } });
    if (!inst) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    // If isCover is true, set all other photos of this installation to false
    if (isCover) {
      await prisma.photo.updateMany({
        where: { installationId: id },
        data: { isCover: false },
      });
    }

    const photo = await prisma.photo.create({
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
      await prisma.installation.update({
        where: { id },
        data: { coverImageId: photo.id },
      });
    }

    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// DELETE /api/admin/photos/:id
// Remove a photo from an installation
router.delete('/photos/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    await prisma.photo.delete({ where: { id } });

    // If we deleted the cover photo, unset coverImageId on installation or pick the next one
    const inst = await prisma.installation.findUnique({
      where: { id: photo.installationId },
      include: { photos: true },
    });

    if (inst && inst.coverImageId === id) {
      const nextCover = inst.photos[0]; // pick first available
      if (nextCover) {
        await prisma.photo.update({
          where: { id: nextCover.id },
          data: { isCover: true },
        });
        await prisma.installation.update({
          where: { id: inst.id },
          data: { coverImageId: nextCover.id },
        });
      } else {
        await prisma.installation.update({
          where: { id: inst.id },
          data: { coverImageId: null },
        });
      }
    }

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
// List all leads/inquiries
router.get('/leads', async (req: AuthRequest, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

// PATCH /api/admin/leads/:id
// Update status of an inquiry (e.g. mark as contacted, closed)
router.patch('/leads/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  if (!status || !['new', 'contacted', 'closed'].includes(status)) {
    res.status(400).json({ error: 'Invalid or missing status value' });
    return;
  }

  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// DELETE /api/admin/leads/:id
// Delete an inquiry lead permanently
router.delete('/leads/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    await prisma.lead.delete({ where: { id } });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;

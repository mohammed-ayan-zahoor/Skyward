import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/installations
// Query params: ?featured=true | ?location=Bengaluru | ?type=Cantilever
router.get('/', async (req: Request, res: Response) => {
  const { featured, location, type } = req.query;

  try {
    const installations = await prisma.installation.findMany({
      where: {
        status: 'published',
        ...(featured === 'true' && { isFeatured: true }),
        ...(location && { location: { equals: location as string, mode: 'insensitive' } }),
        ...(type && { canopyType: { equals: type as string, mode: 'insensitive' } }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        canopyType: true,
        yearCompleted: true,
        description: true,
        isFeatured: true,
        brand: true,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch installations' });
  }
});

// GET /api/installations/:slug
// Returns a single installation with all its photos ordered by sort_order
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  try {
    const installation = await prisma.installation.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch installation' });
  }
});

export default router;

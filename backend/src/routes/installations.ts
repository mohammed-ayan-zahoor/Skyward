import { Router, Request, Response } from 'express';
import { Installation } from '../models/Installation';

const router = Router();

// GET /api/installations
// Query params: ?featured=true | ?location=Bengaluru | ?type=Cantilever
router.get('/', async (req: Request, res: Response) => {
  const { featured, location, type } = req.query;

  try {
    const filter: Record<string, any> = { status: 'published' };
    if (featured === 'true') filter.isFeatured = true;
    if (location) filter.location = new RegExp(location as string, 'i');
    if (type) filter.canopyType = new RegExp(type as string, 'i');

    const rawInstallations = await Installation.find(filter)
      .sort({ isFeatured: -1, yearCompleted: -1 })
      .lean();

    const installations = rawInstallations.map((inst: any) => {
      const coverPhoto = inst.photos?.find((p: any) => p.isCover) || inst.photos?.[0];
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch installations' });
  }
});

// GET /api/installations/:slug
// Returns a single installation with all its photos ordered by sortOrder
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  try {
    const installation = await Installation.findOne({ slug, status: 'published' }).lean();

    if (!installation) {
      res.status(404).json({ error: 'Installation not found' });
      return;
    }

    const photos = (installation.photos || []).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

    res.json({
      ...installation,
      id: (installation as any)._id.toString(),
      photos: photos.map((p: any) => ({
        id: p._id.toString(),
        imageUrl: p.imageUrl,
        caption: p.caption,
        sortOrder: p.sortOrder,
        isCover: p.isCover,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch installation' });
  }
});

export default router;

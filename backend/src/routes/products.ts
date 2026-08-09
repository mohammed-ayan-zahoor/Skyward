import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';

const router = Router();

// GET /api/products
// Public route to fetch published products/services
router.get('/', async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    const filter: Record<string, any> = { status: 'published' };
    if (category) filter.category = new RegExp(category as string, 'i');

    const rawProducts = await Product.find(filter).sort({ createdAt: -1 }).lean();

    const products = rawProducts.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      photos: (p.photos || []).map((ph: any) => ({
        id: ph._id.toString(),
        imageUrl: ph.imageUrl,
        caption: ph.caption,
        isCover: ph.isCover,
      })),
    }));

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  try {
    const product = await Product.findOne({ slug, status: 'published' }).lean();
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({
      ...product,
      id: (product as any)._id.toString(),
      photos: (product.photos || []).map((ph: any) => ({
        id: ph._id.toString(),
        imageUrl: ph.imageUrl,
        caption: ph.caption,
        isCover: ph.isCover,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;

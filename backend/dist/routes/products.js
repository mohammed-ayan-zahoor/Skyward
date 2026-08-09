"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../models/Product");
const router = (0, express_1.Router)();
// GET /api/products
// Public route to fetch published products/services
router.get('/', async (req, res) => {
    const { category } = req.query;
    try {
        const filter = { status: 'published' };
        if (category)
            filter.category = new RegExp(category, 'i');
        const rawProducts = await Product_1.Product.find(filter).sort({ createdAt: -1 }).lean();
        const products = rawProducts.map((p) => ({
            ...p,
            id: p._id.toString(),
            photos: (p.photos || []).map((ph) => ({
                id: ph._id.toString(),
                imageUrl: ph.imageUrl,
                caption: ph.caption,
                isCover: ph.isCover,
            })),
        }));
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const product = await Product_1.Product.findOne({ slug, status: 'published' }).lean();
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({
            ...product,
            id: product._id.toString(),
            photos: (product.photos || []).map((ph) => ({
                id: ph._id.toString(),
                imageUrl: ph.imageUrl,
                caption: ph.caption,
                isCover: ph.isCover,
            })),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
exports.default = router;

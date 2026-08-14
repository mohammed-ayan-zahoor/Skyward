import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Product } from './models/Product';
import { Installation } from './models/Installation';

export const connectDB = async () => {
  const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/skyward_db';
  try {
    await mongoose.connect(mongoURI);
    console.log('[database]: Connected cleanly to MongoDB');

    // Auto-create default admin if not already in DB
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('Sky@563119', 10);
      await User.create({
        email: 'admin@skywardkgf.com',
        passwordHash,
        role: 'admin',
      });
      console.log('[database]: Default admin user (admin@skywardkgf.com) initialized.');
    }

    // Auto-create default products if catalog is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create([
        {
          title: 'Heavy-Duty PEB Steel Columns',
          slug: 'heavy-duty-peb-steel-columns',
          category: 'peb',
          description: 'Grade 350 structural steel columns pre-engineered with internal utility channels for electrical and drainage lines.',
          specifications: 'Grade 350 Structural Steel, IS 800:2007 Compliant, Anti-corrosion primer coating',
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&h=450&q=80',
              caption: 'PEB Column Assembly',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
        {
          title: 'Curved Aluminum Canopy Fascia Sheets',
          slug: 'curved-aluminum-canopy-fascia-sheets',
          category: 'other',
          description: 'Corrosion-resistant powder-coated aluminum fascia sheets available in custom oil major corporate colors.',
          specifications: 'Powder Coated Aluminum, UV & Thermal Resistant, 3mm ACP Panel Thickness',
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&h=400&q=80',
              caption: 'Canopy Fascia Panel Cladding',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
        {
          title: 'High-Lumen Cleanroom LED Underdeck Lights',
          slug: 'high-lumen-cleanroom-led-underdeck-lights',
          category: 'other',
          description: 'IP66 dust and moisture-proof recessed LED lights designed specifically for petrol station underdeck mounts.',
          specifications: '150W Output, IP66 Hazardous Location Rated, 50,000h Lifespan',
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&h=400&q=80',
              caption: 'Underdeck Recessed Light Fixture',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
      ]);
      console.log('[database]: Default products catalog initialized.');
    }

    // Auto-create default installations if works registry is empty
    const installationCount = await Installation.countDocuments();
    if (installationCount === 0) {
      await Installation.create([
        {
          title: 'Shell Service Station Canopy, Bannerghatta',
          slug: 'shell-bannerghatta',
          location: 'Bengaluru',
          canopyType: 'peb',
          yearCompleted: 2024,
          brand: 'INDIAN OIL',
          description: 'A custom cantilever canopy installation designed for maximum vehicle clearance and modern branding visibility at the Shell highway outlet.',
          isFeatured: true,
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=1200&h=800&q=80',
              caption: 'Main entrance overview showcasing cantilever support structure',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
        {
          title: 'IOCL Mega Outlet Canopy, Whitefield',
          slug: 'iocl-whitefield',
          location: 'Bengaluru',
          canopyType: 'peb',
          yearCompleted: 2023,
          brand: 'INDIAN OIL',
          description: 'A high-span curved canopy structure featuring integrated LED fascia lighting and structural steel cladding, completed within a tight 30-day timeline.',
          isFeatured: true,
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&h=800&q=80',
              caption: 'Main highway perspective',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
        {
          title: 'HPCL Station Canopy, Mysuru Highway',
          slug: 'hpcl-mysuru-highway',
          location: 'Mysuru',
          canopyType: 'warehouse',
          yearCompleted: 2022,
          brand: 'BHARAT PETROLEUM',
          description: 'Standard flat-roof canopy with multi-island support columns and heavy-duty storm drainage system integrated into the pillars.',
          isFeatured: false,
          status: 'published',
          photos: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&h=800&q=80',
              caption: 'Highway-facing view of the main canopy',
              sortOrder: 0,
              isCover: true,
            },
          ],
        },
      ]);
      console.log('[database]: Default installations registry initialized.');
    }
  } catch (err) {
    console.error('[database]: MongoDB connection failed:', err);
  }
};

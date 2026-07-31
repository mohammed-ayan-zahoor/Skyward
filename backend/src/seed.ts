import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Installation } from './models/Installation';

const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/skyward_db';

async function seed() {
  console.log('Start seeding MongoDB...');
  await mongoose.connect(mongoURI);

  // 1. Clear existing database collections
  await User.deleteMany({});
  await Installation.deleteMany({});
  console.log('Cleared existing MongoDB records.');

  // 2. Create default Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    email: 'admin@skywardcanopies.com',
    passwordHash,
    role: 'admin',
  });
  console.log(`Created admin user: ${admin.email}`);

  // Helper for placeholder images
  const getPlaceholderUrl = (id: number) => {
    const unsplashPics = [
      'photo-1527018601619-a508a2be00cd',
      'photo-1590069261209-f8e9b8642343',
      'photo-1504917595217-d4dc5ebe6122',
      'photo-1504307651254-35680f356dfd',
    ];
    const pic = unsplashPics[id % unsplashPics.length];
    return `https://images.unsplash.com/${pic}?auto=format&fit=crop&w=1200&h=800&q=80`;
  };

  // 3. Seed Installations
  await Installation.create({
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
        imageUrl: getPlaceholderUrl(1011),
        caption: 'Main entrance overview showcasing cantilever support structure',
        sortOrder: 0,
        isCover: true,
      },
    ],
  });

  await Installation.create({
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
      { imageUrl: getPlaceholderUrl(122), caption: 'Main highway perspective', sortOrder: 0, isCover: true },
      { imageUrl: getPlaceholderUrl(133), caption: 'Side view showing lane alignment', sortOrder: 1, isCover: false },
      { imageUrl: getPlaceholderUrl(144), caption: 'Dusk view with active LED fascia lighting', sortOrder: 2, isCover: false },
    ],
  });

  await Installation.create({
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
      { imageUrl: getPlaceholderUrl(210), caption: 'Highway-facing view of the main canopy', sortOrder: 0, isCover: true },
      { imageUrl: getPlaceholderUrl(211), caption: 'Multi-island dispenser layout', sortOrder: 1, isCover: false },
    ],
  });

  console.log('MongoDB database seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing database entries (order matters for foreign keys)
  await prisma.photo.deleteMany({});
  await prisma.installation.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Cleared existing database records.');

  // 2. Create default Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@skywardcanopies.com',
      passwordHash,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Helper to generate context-relevant Unsplash image URLs of fuel stations and structural steel
  const getPlaceholderUrl = (id: number) => {
    const unsplashPics = [
      'photo-1527018601619-a508a2be00cd', // Shell/Night glowing canopy
      'photo-1590069261209-f8e9b8642343', // Clean modern service station canopy
      'photo-1504917595217-d4dc5ebe6122', // Under construction steel columns
      'photo-1504307651254-35680f356dfd'  // Structural steel construction worker
    ];
    const pic = unsplashPics[id % unsplashPics.length];
    return `https://images.unsplash.com/${pic}?auto=format&fit=crop&w=1200&h=800&q=80`;
  };

  // 3. Seed Installations
  
  // Installation 1: 1 photo (stress case for layout with a single photo)
  const inst1 = await prisma.installation.create({
    data: {
      title: 'Shell Service Station Canopy, Bannerghatta',
      slug: 'shell-bannerghatta',
      location: 'Bengaluru',
      canopyType: 'Cantilever',
      yearCompleted: 2024,
      description: 'A custom cantilever canopy installation designed for maximum vehicle clearance and modern branding visibility at the Shell highway outlet.',
      isFeatured: true,
      status: 'published',
      photos: {
        create: [
          {
            imageUrl: getPlaceholderUrl(1011),
            caption: 'Main entrance overview showcasing cantilever support structure',
            sortOrder: 0,
            isCover: true,
          }
        ]
      }
    },
    include: { photos: true }
  });
  
  // Set the coverImageId for Installation 1
  await prisma.installation.update({
    where: { id: inst1.id },
    data: { coverImageId: inst1.photos[0].id }
  });
  console.log('Seeded Installation 1: Shell Bannerghatta (1 Photo)');

  // Installation 2: 12 photos (stress case for large photo gallery)
  const inst2PhotosData = [
    { url: getPlaceholderUrl(122), caption: 'Main highway perspective', order: 0, cover: true },
    { url: getPlaceholderUrl(133), caption: 'Side view showing lane alignment', order: 1, cover: false },
    { url: getPlaceholderUrl(144), caption: 'Dusk view with active LED fascia lighting', order: 2, cover: false },
    { url: getPlaceholderUrl(155), caption: 'Close-up of column structural base', order: 3, cover: false },
    { url: getPlaceholderUrl(166), caption: 'Under-canopy ceiling lighting layout', order: 4, cover: false },
    { url: getPlaceholderUrl(177), caption: 'Drainage system integration detail', order: 5, cover: false },
    { url: getPlaceholderUrl(188), caption: 'Front fascia branding close-up', order: 6, cover: false },
    { url: getPlaceholderUrl(199), caption: 'Wide angle view from street level', order: 7, cover: false },
    { url: getPlaceholderUrl(200), caption: 'Night-time illumination profile', order: 8, cover: false },
    { url: getPlaceholderUrl(201), caption: 'Structural connection detail', order: 9, cover: false },
    { url: getPlaceholderUrl(202), caption: 'Construction phase assembly', order: 10, cover: false },
    { url: getPlaceholderUrl(203), caption: 'Completed hand-off overview', order: 11, cover: false }
  ];

  const inst2 = await prisma.installation.create({
    data: {
      title: 'IOCL Mega Outlet Canopy, Whitefield',
      slug: 'iocl-whitefield',
      location: 'Bengaluru',
      canopyType: 'Curved Fascia',
      yearCompleted: 2023,
      description: 'A high-span curved canopy structure featuring integrated LED fascia lighting and structural steel cladding, completed within a tight 30-day timeline.',
      isFeatured: true,
      status: 'published',
      photos: {
        create: inst2PhotosData.map(p => ({
          imageUrl: p.url,
          caption: p.caption,
          sortOrder: p.order,
          isCover: p.cover
        }))
      }
    },
    include: { photos: true }
  });

  const coverPhoto2 = inst2.photos.find(p => p.isCover);
  if (coverPhoto2) {
    await prisma.installation.update({
      where: { id: inst2.id },
      data: { coverImageId: coverPhoto2.id }
    });
  }
  console.log('Seeded Installation 2: IOCL Whitefield (12 Photos)');

  // Installation 3: 4 photos
  const inst3PhotosData = [
    { url: getPlaceholderUrl(210), caption: 'Highway-facing view of the main canopy', order: 0, cover: true },
    { url: getPlaceholderUrl(211), caption: 'Multi-island dispenser layout', order: 1, cover: false },
    { url: getPlaceholderUrl(212), caption: 'Pillar reinforcement detail', order: 2, cover: false },
    { url: getPlaceholderUrl(213), caption: 'Fascia joint cladding detail', order: 3, cover: false }
  ];

  const inst3 = await prisma.installation.create({
    data: {
      title: 'HPCL Station Canopy, Mysuru Highway',
      slug: 'hpcl-mysuru-highway',
      location: 'Mysuru',
      canopyType: 'Flat-roof',
      yearCompleted: 2022,
      description: 'Standard flat-roof canopy with multi-island support columns and heavy-duty storm drainage system integrated into the pillars.',
      isFeatured: false,
      status: 'published',
      photos: {
        create: inst3PhotosData.map(p => ({
          imageUrl: p.url,
          caption: p.caption,
          sortOrder: p.order,
          isCover: p.cover
        }))
      }
    },
    include: { photos: true }
  });

  const coverPhoto3 = inst3.photos.find(p => p.isCover);
  if (coverPhoto3) {
    await prisma.installation.update({
      where: { id: inst3.id },
      data: { coverImageId: coverPhoto3.id }
    });
  }
  console.log('Seeded Installation 3: HPCL Mysuru Highway (4 Photos)');

  // Installation 4: 2 photos (Draft project - only visible in admin panel)
  const inst4PhotosData = [
    { url: getPlaceholderUrl(220), caption: 'Rendering of the planned canopy system', order: 0, cover: true },
    { url: getPlaceholderUrl(221), caption: 'Site foundation preparation', order: 1, cover: false }
  ];

  const inst4 = await prisma.installation.create({
    data: {
      title: 'Jio-bp Outlet Canopy, Hubli',
      slug: 'jio-bp-hubli',
      location: 'Hubli',
      canopyType: 'Flat-roof',
      yearCompleted: 2025,
      description: 'Draft installation showcase of a newly designed double-canopy system for a high-traffic highway outlet.',
      isFeatured: false,
      status: 'draft',
      photos: {
        create: inst4PhotosData.map(p => ({
          imageUrl: p.url,
          caption: p.caption,
          sortOrder: p.order,
          isCover: p.cover
        }))
      }
    },
    include: { photos: true }
  });

  const coverPhoto4 = inst4.photos.find(p => p.isCover);
  if (coverPhoto4) {
    await prisma.installation.update({
      where: { id: inst4.id },
      data: { coverImageId: coverPhoto4.id }
    });
  }
  console.log('Seeded Installation 4: Jio-bp Hubli (2 Photos, Draft status)');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

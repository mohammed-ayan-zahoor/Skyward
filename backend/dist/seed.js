"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("./models/User");
const Installation_1 = require("./models/Installation");
const Product_1 = require("./models/Product");
const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/skyward_db';
async function seed() {
    console.log('Start seeding MongoDB...');
    await mongoose_1.default.connect(mongoURI);
    // 1. Clear existing database collections
    await User_1.User.deleteMany({});
    await Installation_1.Installation.deleteMany({});
    await Product_1.Product.deleteMany({});
    console.log('Cleared existing MongoDB records.');
    // 2. Create default Admin User
    const passwordHash = await bcrypt_1.default.hash('Sky@563119', 10);
    const admin = await User_1.User.create({
        email: 'admin@skywardkgf.com',
        passwordHash,
        role: 'admin',
    });
    console.log(`Created admin user: ${admin.email}`);
    // Helper for placeholder images
    const getPlaceholderUrl = (id) => {
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
    await Installation_1.Installation.create({
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
    await Installation_1.Installation.create({
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
    await Installation_1.Installation.create({
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
    // 4. Seed Products / Services Catalog
    await Product_1.Product.create({
        title: 'Pre-Engineered Building (PEB) Industrial Shed',
        slug: 'peb-industrial-shed',
        category: 'peb',
        description: 'Custom-designed Pre-Engineered Building (PEB) structural steel framing for factories, manufacturing plants, and industrial logistics facilities.',
        specifications: 'Grade 350 Steel, Wind Speed Rating 160 km/h, Clear-span up to 60m',
        status: 'published',
        photos: [
            { imageUrl: getPlaceholderUrl(301), caption: 'PEB Frame Assembly Overview', sortOrder: 0, isCover: true }
        ],
    });
    await Product_1.Product.create({
        title: 'High-Capacity Storage Warehouse Facility',
        slug: 'high-capacity-warehouse',
        category: 'warehouse',
        description: 'Heavy-duty structural warehouse featuring high-ceiling clearance, insulated roofing sheets, and reinforced loading dock canopy overhangs.',
        specifications: 'Galvalume Standing Seam Roof, Insulated Sandwich Panels, EOT Crane Compatibility',
        status: 'published',
        photos: [
            { imageUrl: getPlaceholderUrl(302), caption: 'Logistics Warehouse Structural Framing', sortOrder: 0, isCover: true }
        ],
    });
    await Product_1.Product.create({
        title: 'Double-Cantilever Fuel Station Canopy System',
        slug: 'cantilever-fuel-canopy',
        category: 'other',
        description: 'B2B certified fuel dispenser canopy system engineered with internal storm drainage, illuminated ACP fascia cladding, and state-certified wind load calculations.',
        specifications: 'IS 800:2007 Compliant, ACP Fascia Cladding, Waterproof Ceiling Systems',
        status: 'published',
        photos: [
            { imageUrl: getPlaceholderUrl(303), caption: 'Cantilever Fuel Canopy Structure', sortOrder: 0, isCover: true }
        ],
    });
    console.log('MongoDB database seeding completed successfully!');
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});

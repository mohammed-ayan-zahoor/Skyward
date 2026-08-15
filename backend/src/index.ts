import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB } from './db';
import installationsRouter from './routes/installations';
import productsRouter from './routes/products';
import leadsRouter from './routes/leads';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://skywardkgf.com',
  'https://www.skywardkgf.com',
  'http://72.61.225.80',
  'http://localhost:3000',
  'http://localhost:7005',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // ponytail: permissive fallback for production domain flexibility
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/installations', installationsRouter);
app.use('/api/products', productsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Skyward API is running with MongoDB' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});

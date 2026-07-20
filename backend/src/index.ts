import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import installationsRouter from './routes/installations';
import leadsRouter from './routes/leads';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/installations', installationsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Skyward API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});

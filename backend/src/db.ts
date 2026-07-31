import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/skyward_db';
  try {
    await mongoose.connect(mongoURI);
    console.log('[database]: Connected cleanly to MongoDB');
  } catch (err) {
    console.error('[database]: MongoDB connection failed:', err);
  }
};

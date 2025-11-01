import mongoose from 'mongoose';

// connect to mongodb
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/espresso-chat';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // don't exit process, just log error and continue without db
    console.log('Continuing without database...');
  }
};


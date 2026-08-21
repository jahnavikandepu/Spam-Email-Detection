import mongoose from 'mongoose';

// Disable command buffering so queries fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

/**
 * Connect to MongoDB instance safely (non-blocking for app execution)
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spamguard';

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'spamguard',
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    if (!mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost')) {
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/spamguard', {
          dbName: 'spamguard',
          serverSelectionTimeoutMS: 3000,
        });
        console.log('MongoDB connected successfully');
        return;
      } catch (localErr) {
        console.warn(`[MongoDB Warning] Connection failed: ${error.message}. Backend running without DB persistence.`);
      }
    } else {
      console.warn(`[MongoDB Warning] Connection failed: ${error.message}. Backend running without DB persistence.`);
    }
  }
};

export default connectDB;

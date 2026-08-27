import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance safely with automatic local fallback
 */
const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spamguard';
  const localUri = 'mongodb://127.0.0.1:27017/spamguard';

  // Try primary URI first
  try {
    console.log(`[MongoDB] Connecting to primary database...`);
    await mongoose.connect(primaryUri, {
      dbName: 'spamguard',
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    console.log('MongoDB connected successfully');
    return;
  } catch (primaryErr) {
    console.warn(`[MongoDB Warning] Primary connection failed: ${primaryErr.message}`);
  }

  // If primary was not local, try local MongoDB fallback
  if (!primaryUri.includes('127.0.0.1') && !primaryUri.includes('localhost')) {
    try {
      console.log(`[MongoDB] Attempting fallback to local MongoDB at ${localUri}...`);
      await mongoose.disconnect().catch(() => {});
      await mongoose.connect(localUri, {
        dbName: 'spamguard',
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
      });
      console.log('MongoDB connected successfully to local fallback');
      return;
    } catch (localErr) {
      console.warn(`[MongoDB Warning] Local fallback failed: ${localErr.message}. Running with in-memory persistence fallback.`);
    }
  } else {
    console.warn(`[MongoDB Warning] Database unavailable. Running with in-memory persistence fallback.`);
  }
};

export default connectDB;

import mongoose from 'mongoose';

// Disable command buffering so queries fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

/**
 * Connect to MongoDB instance
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spamguard';

  try {
    await mongoose.connect(mongoUri, { dbName: 'spamguard' });
    console.log('MongoDB connected successfully');
  } catch (error) {
    // If primary connection fails (e.g. Atlas bad auth) and it wasn't local, try local MongoDB fallback
    if (!mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost')) {
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/spamguard', { dbName: 'spamguard' });
        console.log('MongoDB connected successfully');
        return;
      } catch (localErr) {
        console.error(`[MongoDB Error] Connection failed: ${error.message}`);
      }
    } else {
      console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    }
  }
};

export default connectDB;

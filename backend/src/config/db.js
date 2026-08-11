import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spamguard');
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // Do not exit process so app stays alive with warning
  }
};

export default connectDB;

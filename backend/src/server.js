import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start Express HTTP Server
app.listen(PORT, () => {
  console.log(`[SpamGuard Backend] Express server running at http://localhost:${PORT}`);
  console.log(`[SpamGuard Backend] Health check: http://localhost:${PORT}/api/health`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import predictionRoutes from './routes/predictionRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Enable CORS for frontend CLIENT_URL and local dev servers
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      origin === clientUrl ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for development
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Backend Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SpamGuard backend is running',
  });
});

// API Routes
app.use('/api/predict', predictionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);

// Handle unknown API endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;

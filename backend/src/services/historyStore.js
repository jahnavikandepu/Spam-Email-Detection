import mongoose from 'mongoose';
import Prediction from '../models/Prediction.js';

// In-memory fallback cache for when DB is offline or reconnecting
const inMemoryStore = [];

/**
 * Check if MongoDB connection is open and ready
 */
export function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Save prediction record to MongoDB and memory cache
 */
export async function savePredictionRecord({ emailContent, emailPreview, prediction, confidence }) {
  const createdAt = new Date();
  const id = new mongoose.Types.ObjectId().toString();

  const record = {
    _id: id,
    emailContent,
    emailPreview,
    prediction,
    confidence,
    createdAt,
  };

  // Always keep in memory store
  inMemoryStore.unshift(record);
  if (inMemoryStore.length > 500) {
    inMemoryStore.pop();
  }

  // Save to MongoDB if available
  if (isDbConnected()) {
    try {
      const dbDoc = await Prediction.create({
        _id: id,
        emailContent,
        emailPreview,
        prediction,
        confidence,
        createdAt,
      });
      return dbDoc;
    } catch (err) {
      console.warn('[HistoryStore Warning] MongoDB insert error:', err.message);
    }
  }

  return record;
}

/**
 * Retrieve prediction history records with filtering
 */
export async function getPredictionRecords({ search, prediction }) {
  let records = [];

  if (isDbConnected()) {
    try {
      const query = {};
      if (prediction && ['spam', 'not_spam'].includes(prediction.toLowerCase())) {
        query.prediction = prediction.toLowerCase();
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { emailContent: regex },
          { emailPreview: regex },
        ];
      }

      records = await Prediction.find(query)
        .sort({ createdAt: -1 })
        .select('_id emailPreview prediction confidence createdAt emailContent')
        .lean();
        
      return records;
    } catch (err) {
      console.warn('[HistoryStore Warning] DB query failed, falling back to in-memory records:', err.message);
    }
  }

  // In-memory fallback filtering
  let filtered = [...inMemoryStore];
  if (prediction && ['spam', 'not_spam'].includes(prediction.toLowerCase())) {
    filtered = filtered.filter(r => r.prediction === prediction.toLowerCase());
  }
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter(r => 
      (r.emailContent && r.emailContent.toLowerCase().includes(term)) ||
      (r.emailPreview && r.emailPreview.toLowerCase().includes(term))
    );
  }

  return filtered;
}

/**
 * Retrieve a single prediction record by ID
 */
export async function getPredictionRecordById(id) {
  if (isDbConnected()) {
    try {
      const doc = await Prediction.findById(id).lean();
      if (doc) return doc;
    } catch (err) {
      console.warn('[HistoryStore Warning] DB findById error:', err.message);
    }
  }

  return inMemoryStore.find(r => r._id.toString() === id.toString()) || null;
}

/**
 * Delete all prediction history records
 */
export async function clearAllPredictionRecords() {
  inMemoryStore.length = 0;

  if (isDbConnected()) {
    try {
      await Prediction.deleteMany({});
    } catch (err) {
      console.warn('[HistoryStore Warning] DB deleteMany error:', err.message);
    }
  }
}

/**
 * Delete a single prediction history record by ID
 */
export async function deletePredictionRecordById(id) {
  const memIndex = inMemoryStore.findIndex(r => r._id.toString() === id.toString());
  if (memIndex !== -1) {
    inMemoryStore.splice(memIndex, 1);
  }

  if (isDbConnected()) {
    try {
      return await Prediction.findByIdAndDelete(id);
    } catch (err) {
      console.warn('[HistoryStore Warning] DB findByIdAndDelete error:', err.message);
    }
  }

  return memIndex !== -1 ? true : null;
}

/**
 * Get aggregate statistics
 */
export async function getPredictionStats() {
  if (isDbConnected()) {
    try {
      const totalEmails = await Prediction.countDocuments();
      const spamEmails = await Prediction.countDocuments({ prediction: 'spam' });
      const notSpamEmails = await Prediction.countDocuments({ prediction: 'not_spam' });

      const spamPercentage = totalEmails > 0
        ? Number(((spamEmails / totalEmails) * 100).toFixed(1))
        : 0;

      return {
        totalEmails,
        spamEmails,
        notSpamEmails,
        spamPercentage,
      };
    } catch (err) {
      console.warn('[HistoryStore Warning] DB stats error:', err.message);
    }
  }

  // Fallback to in-memory stats
  const totalEmails = inMemoryStore.length;
  const spamEmails = inMemoryStore.filter(r => r.prediction === 'spam').length;
  const notSpamEmails = inMemoryStore.filter(r => r.prediction === 'not_spam').length;
  const spamPercentage = totalEmails > 0
    ? Number(((spamEmails / totalEmails) * 100).toFixed(1))
    : 0;

  return {
    totalEmails,
    spamEmails,
    notSpamEmails,
    spamPercentage,
  };
}

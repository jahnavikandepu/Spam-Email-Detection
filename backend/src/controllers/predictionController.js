import Prediction from '../models/Prediction.js';
import { getMlPrediction } from '../services/mlService.js';

/**
 * @desc    Predict spam vs not_spam for email content and save result to database
 * @route   POST /api/predict
 * @access  Public
 */
export const predictEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Validation: check missing, empty, or whitespace-only strings
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email content',
      });
    }

    const trimmedContent = email.trim();

    // 2. Call Python FastAPI ML Service
    const mlResult = await getMlPrediction(trimmedContent);

    // 3. Format email preview for history listing
    const emailPreview = trimmedContent.length > 120
      ? trimmedContent.substring(0, 120) + '...'
      : trimmedContent;

    // 4. Save successful prediction record to MongoDB (if database is connected)
    let savedRecord = null;
    if (Prediction.db && Prediction.db.readyState === 1) {
      try {
        savedRecord = await Prediction.create({
          emailContent: trimmedContent,
          emailPreview,
          prediction: mlResult.prediction,
          confidence: mlResult.confidence,
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.error('[MongoDB Error] Could not save prediction record:', dbErr.message);
      }
    } else {
      console.warn('[MongoDB Warning] Database not connected. Skipping prediction storage.');
    }

    // 5. Return structured JSON response to React frontend
    const isSpam = mlResult.prediction === 'spam';

    return res.status(200).json({
      success: true,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      message: isSpam ? 'Spam email detected' : 'Email appears to be legitimate',
      id: savedRecord ? savedRecord._id : null,
    });

  } catch (error) {
    next(error);
  }
};

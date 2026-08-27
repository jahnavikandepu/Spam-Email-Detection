import { getMlPrediction } from '../services/pythonMlService.js';
import { savePredictionRecord } from '../services/historyStore.js';

/**
 * @desc    Predict spam vs not_spam for email content using Python predict.py script
 * @route   POST /api/predict
 * @access  Public
 */
export const predictEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Validation: check missing, non-string, or empty/whitespace-only strings
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email content',
      });
    }

    const trimmedContent = email.trim();

    // 2. Call Python ML Service via child_process spawn
    const mlResult = await getMlPrediction(trimmedContent);

    // 3. Format email preview for history listing
    const emailPreview = trimmedContent.length > 120
      ? trimmedContent.substring(0, 120) + '...'
      : trimmedContent;

    // 4. Save prediction record to persistent MongoDB and memory cache
    const savedRecord = await savePredictionRecord({
      emailContent: trimmedContent,
      emailPreview,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
    });

    // 5. Return structured JSON response to React frontend
    const isSpam = mlResult.prediction === 'spam';

    return res.status(200).json({
      success: true,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      message: isSpam ? 'Spam email detected' : 'Email appears to be legitimate',
      id: savedRecord ? (savedRecord._id || savedRecord.id) : null,
    });

  } catch (error) {
    next(error);
  }
};


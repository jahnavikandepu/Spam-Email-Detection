import { getPredictionStats } from '../services/historyStore.js';

/**
 * @desc    Get aggregate statistics of analyzed emails
 * @route   GET /api/stats
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await getPredictionStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.warn('[Stats Controller Warning] getStats failed:', error.message);
    return res.status(200).json({
      success: true,
      data: {
        totalEmails: 0,
        spamEmails: 0,
        notSpamEmails: 0,
        spamPercentage: 0,
      },
    });
  }
};


import Prediction from '../models/Prediction.js';

/**
 * @desc    Get aggregate statistics of analyzed emails
 * @route   GET /api/stats
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const totalEmails = await Prediction.countDocuments();
    const spamEmails = await Prediction.countDocuments({ prediction: 'spam' });
    const notSpamEmails = await Prediction.countDocuments({ prediction: 'not_spam' });

    const spamPercentage = totalEmails > 0 
      ? Number(((spamEmails / totalEmails) * 100).toFixed(1)) 
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalEmails,
        spamEmails,
        notSpamEmails,
        spamPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

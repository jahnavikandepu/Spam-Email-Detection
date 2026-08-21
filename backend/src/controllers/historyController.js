import Prediction from '../models/Prediction.js';

/**
 * @desc    Get all prediction history records with optional search & prediction filters
 * @route   GET /api/history
 * @access  Public
 */
export const getHistory = async (req, res, next) => {
  try {
    if (!Prediction.db || Prediction.db.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'Database not connected',
      });
    }

    const { search, prediction } = req.query;

    // Build Mongoose query object
    const query = {};

    if (prediction && ['spam', 'not_spam'].includes(prediction.toLowerCase())) {
      query.prediction = prediction.toLowerCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { emailContent: searchRegex },
        { emailPreview: searchRegex }
      ];
    }

    // Query database sorted by newest first
    const records = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .select('_id emailPreview prediction confidence createdAt emailContent');

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single prediction history item by ID
 * @route   GET /api/history/:id
 * @access  Public
 */
export const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await Prediction.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Prediction history record not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid history record ID format',
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete all prediction history records
 * @route   DELETE /api/history
 * @access  Public
 */
export const deleteHistory = async (req, res, next) => {
  try {
    await Prediction.deleteMany({});

    return res.status(200).json({
      success: true,
      message: 'Prediction history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a single prediction history record by ID
 * @route   DELETE /api/history/:id
 * @access  Public
 */
export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await Prediction.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Prediction history record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prediction record deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid history record ID format',
      });
    }
    next(error);
  }
};

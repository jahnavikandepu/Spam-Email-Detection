import {
  getPredictionRecords,
  getPredictionRecordById,
  clearAllPredictionRecords,
  deletePredictionRecordById,
} from '../services/historyStore.js';

/**
 * @desc    Get all prediction history records with optional search & prediction filters
 * @route   GET /api/history
 * @access  Public
 */
export const getHistory = async (req, res, next) => {
  try {
    const { search, prediction } = req.query;

    const records = await getPredictionRecords({ search, prediction });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.warn('[History Controller Warning] getHistory error:', error.message);
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: error.message,
    });
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
    const record = await getPredictionRecordById(id);

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
    console.warn('[History Controller Warning] getHistoryById error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve record',
    });
  }
};

/**
 * @desc    Delete all prediction history records
 * @route   DELETE /api/history
 * @access  Public
 */
export const deleteHistory = async (req, res, next) => {
  try {
    await clearAllPredictionRecords();

    return res.status(200).json({
      success: true,
      message: 'Prediction history cleared successfully',
    });
  } catch (error) {
    console.warn('[History Controller Warning] deleteHistory error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear prediction history',
    });
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
    const deleted = await deletePredictionRecordById(id);

    if (!deleted) {
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
    console.warn('[History Controller Warning] deleteHistoryItem error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete record',
    });
  }
};


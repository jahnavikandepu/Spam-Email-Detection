import express from 'express';
import { 
  getHistory, 
  getHistoryById, 
  deleteHistory, 
  deleteHistoryItem 
} from '../controllers/historyController.js';

const router = express.Router();

router.route('/')
  .get(getHistory)
  .delete(deleteHistory);

router.route('/:id')
  .get(getHistoryById)
  .delete(deleteHistoryItem);

export default router;

import express from 'express';
import { predictEmail } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', predictEmail);

export default router;

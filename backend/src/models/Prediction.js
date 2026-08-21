import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  emailContent: {
    type: String,
    required: [true, 'Email content is required'],
    trim: true,
  },
  emailPreview: {
    type: String,
    required: true,
    trim: true,
  },
  prediction: {
    type: String,
    required: [true, 'Prediction result is required'],
  },
  confidence: {
    type: Number,
    required: [true, 'Confidence score is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically format emailPreview before saving if not explicitly set
predictionSchema.pre('validate', function (next) {
  if (this.emailContent && !this.emailPreview) {
    const trimmed = this.emailContent.trim();
    this.emailPreview = trimmed.length > 120 
      ? trimmed.substring(0, 120) + '...' 
      : trimmed;
  }
  next();
});

const Prediction = mongoose.model('Prediction', predictionSchema, 'predictions');

export default Prediction;

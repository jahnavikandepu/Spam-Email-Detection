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
    enum: ['spam', 'not_spam'],
    required: [true, 'Prediction result is required'],
  },
  confidence: {
    type: Number,
    required: [true, 'Confidence score is required'],
    min: 0,
    max: 1,
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

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;

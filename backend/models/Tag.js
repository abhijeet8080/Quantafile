
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });


export default mongoose.models.Tag || mongoose.model('Tag', tagSchema);


import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  itemType: {
    type: String,
    enum: ['question', 'answer'],
    required: true
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  type: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;

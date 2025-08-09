import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },
  score: {
  type: Number,
  default: 0
},

  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],

  status: {
    type: String,
    enum: ['open', 'answered', 'closed'],
    default: 'open'
  },

  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

questionSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Question = mongoose.model('Question', questionSchema);
export default Question

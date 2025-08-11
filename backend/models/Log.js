import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'DELETE_QUESTION',
        'DELETE_ANSWER',
        'BAN_USER',
        'UNBAN_USER',
        'CHANGE_ROLE',
        'TOGGLE_QUESTION_STATUS'
      ],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel',
    },
    targetModel: {
      type: String,
      enum: ['Question', 'Answer', 'User'],
      required: true,
    },
    reason: {
      type: String,
      default: 'Not specified',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

export default Log
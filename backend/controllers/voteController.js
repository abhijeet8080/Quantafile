// controllers/voteController.js
import Vote from '../models/Vote.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';

export const voteOnItem = async (req, res) => {
  const { itemType, itemId, type } = req.body;
  const userId = req.user._id;

  if (!['question', 'answer'].includes(itemType) || !['upvote', 'downvote'].includes(type)) {
    return res.status(400).json({ message: 'Invalid vote parameters' });
  }

  try {
    let itemModel = itemType === 'question' ? Question : Answer;

    // Find item to get author
    const item = await itemModel.findById(itemId).populate('user');
    if (!item) return res.status(404).json({ message: `${itemType} not found` });

    const authorId = item.user._id.toString();

    // Check if vote already exists
    const existingVote = await Vote.findOne({ user: userId, itemType, itemId });

    if (existingVote) {
      if (existingVote.type === type) {
        // Toggle off vote (remove)
        await existingVote.remove();

        // Revert reputation
        await adjustReputation(authorId, type, itemType, 'remove');
        if (type === 'downvote' && userId !== authorId) {
          await adjustReputation(userId, type, itemType, 'remove', true);
        }
      } else {
        // Change vote
        await adjustReputation(authorId, existingVote.type, itemType, 'remove');
        if (existingVote.type === 'downvote' && userId !== authorId) {
          await adjustReputation(userId, existingVote.type, itemType, 'remove', true);
        }

        existingVote.type = type;
        await existingVote.save();

        await adjustReputation(authorId, type, itemType, 'add');
        if (type === 'downvote' && userId !== authorId) {
          await adjustReputation(userId, type, itemType, 'add', true);
        }
      }
    } else {
      // New vote
      await Vote.create({ user: userId, itemType, itemId, type });

      await adjustReputation(authorId, type, itemType, 'add');
      if (type === 'downvote' && userId !== authorId) {
        await adjustReputation(userId, type, itemType, 'add', true);
      }
    }

    // Recalculate score
    const upvotes = await Vote.countDocuments({ itemType, itemId, type: 'upvote' });
    const downvotes = await Vote.countDocuments({ itemType, itemId, type: 'downvote' });
    const score = upvotes - downvotes;

    // Update score
    await itemModel.findByIdAndUpdate(itemId, { score });

    res.status(200).json({ message: 'Vote recorded', score });
  } catch (error) {
    res.status(500).json({ message: 'Voting failed', error: error.message });
  }
};


const adjustReputation = async (userId, voteType, itemType, action, isVoter = false) => {
  const user = await User.findById(userId);
  if (!user) return;

  let change = 0;

  if (isVoter) {
    // voter loses 1 point for downvoting
    if (voteType === 'downvote') change = -1;
  } else {
    if (voteType === 'upvote') {
      change = itemType === 'question' ? 5 : 10;
    } else if (voteType === 'downvote') {
      change = -2;
    }
  }

  if (action === 'remove') change = -change;

  user.reputation = (user.reputation || 0) + change;
  await user.save();
};

// controllers/voteController.js
import Vote from '../models/Vote.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';

export const voteOnItem = async (req, res) => {
  console.log("[voteOnItem] Called");
  
  const { itemType, itemId, type } = req.body;
  console.log(`[voteOnItem] Request body: itemType=${itemType}, itemId=${itemId}, type=${type}`);

  const userId = req.user.id;
  console.log(`[voteOnItem] Voting userId: ${userId}`);

  if (!['question', 'answer'].includes(itemType) || !['upvote', 'downvote'].includes(type)) {
    console.warn("[voteOnItem] Invalid vote parameters");
    return res.status(400).json({ message: 'Invalid vote parameters' });
  }
  console.log("[voteOnItem] Vote parameters validated");

  try {
    const itemModel = itemType === 'question' ? Question : Answer;
    console.log(`[voteOnItem] Using itemModel: ${itemType}`);

    // Find the item to get author
    const item = await itemModel.findById(itemId).populate('author');
    if (!item) {
      console.warn(`[voteOnItem] ${itemType} with id ${itemId} not found`);
      return res.status(404).json({ message: `${itemType} not found` });
    }
    console.log(`[voteOnItem] Found ${itemType} with id ${itemId}`);

    const authorId = item.author._id.toString();
    console.log(`[voteOnItem] Author of the item: ${authorId}`);

    // Check if the user already voted on this item
    const existingVote = await Vote.findOne({ user: userId, itemType, itemId });
    console.log(`[voteOnItem] Existing vote found: ${existingVote ? "YES" : "NO"}`);

    if (existingVote) {
      if (existingVote.type === type) {
        console.log("[voteOnItem] User toggling off their existing vote");
        await existingVote.deleteOne();
        console.log("[voteOnItem] Existing vote removed");

        await adjustReputation(authorId, type, itemType, 'remove');
        if (type === 'downvote' && userId !== authorId) {
          await adjustReputation(userId, type, itemType, 'remove', true);
        }
        console.log("[voteOnItem] Reputation adjusted after vote removal");
      } else {
        console.log("[voteOnItem] User changing vote type");
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
        console.log("[voteOnItem] Vote type changed and reputation updated");
      }
    } else {
      console.log("[voteOnItem] Creating new vote");
      await Vote.create({ user: userId, itemType, itemId, type });

      await adjustReputation(authorId, type, itemType, 'add');
      if (type === 'downvote' && userId !== authorId) {
        await adjustReputation(userId, type, itemType, 'add', true);
      }
      console.log("[voteOnItem] New vote created and reputation updated");
    }

    // Recalculate score
    const upvotes = await Vote.countDocuments({ itemType, itemId, type: 'upvote' });
    const downvotes = await Vote.countDocuments({ itemType, itemId, type: 'downvote' });
    const score = upvotes - downvotes;
    console.log(`[voteOnItem] Recalculated score: ${score} (upvotes: ${upvotes}, downvotes: ${downvotes})`);

    // Update score on item
    await itemModel.findByIdAndUpdate(itemId, { score });
    console.log(`[voteOnItem] Updated ${itemType} score in DB`);

    res.status(200).json({ message: 'Vote recorded', score,upvoteCount: upvotes,
  downvoteCount: downvotes });
  } catch (error) {
    console.error("[voteOnItem] Voting failed:", error);
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

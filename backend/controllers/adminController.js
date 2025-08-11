// controllers/adminController.js
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Tag from '../models/Tag.js';
import Vote from '../models/Vote.js';
import Log from '../models/Log.js';

// ===== Helper: Admin logging =====
export const logAction = async (action, targetId, targetModel, reason, performedBy) => {
  if (!performedBy) {
    console.error("logAction called without performedBy");
    throw new Error("performedBy is required");
  }
  await Log.create({ action, targetId, targetModel, reason, performedBy });
};

/* ================================
   1. USER MANAGEMENT
================================ */
export const getAllUsers = async (req, res) => {
  try {
    console.log('get all users called')
    const { role, isBanned, startDate, endDate, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isBanned !== undefined) filter.isBanned = isBanned === 'true';
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { _id: search }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const banUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(403).json({ message: 'Authenticated user ID missing' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    await logAction('BAN_USER', user._id, 'User', 'Violation', req.user.id);
    res.json({ message: 'User banned successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(403).json({ message: 'Authenticated user ID missing' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    await logAction('UNBAN_USER', user._id, 'User', 'Manual unban', req.user.id);
    res.json({ message: 'User unbanned successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    console.log("changeUserRole called");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("Authenticated user:", req.user);

    if (!req.user?.id) {
      return res.status(403).json({ message: 'Authenticated user ID missing' });
    }

    const { role } = req.body;
    if (!['user', 'moderator', 'admin'].includes(role)) {
      console.warn(`Invalid role provided: ${role}`);
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      console.warn(`User not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    await logAction('CHANGE_ROLE', user._id, 'User', `Role changed to ${role}`, req.user.id);
    res.json({ message: 'User role updated', user });

  } catch (err) {
    console.error("Error in changeUserRole:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};


/* ================================
   2. QUESTION MANAGEMENT
================================ */
export const getAllQuestions = async (req, res) => {
  try {
    const { status, search, tag } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const questions = await Question.find(filter)
      .populate('author', 'username email')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    console.error('Error in getAllQuestions:', err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestionAdmin = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    await question.deleteOne();

    await logAction(
      'DELETE_QUESTION',
      question._id,
      'Question',
      req.body.reason || 'Not specified',
      req.user.id
    );

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error in deleteQuestionAdmin:', err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleQuestionStatus = async (req, res) => {
  try {
    console.log(req.user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.status = question.status === 'closed' ? 'open' : 'closed';
    await question.save();

    await logAction(
      'TOGGLE_QUESTION_STATUS',
      question._id,
      'Question',
      `Status changed to ${question.status}`,
      req.user.id
    );

    res.json({ message: 'Question status updated', question });
  } catch (err) {
    console.error('Error in toggleQuestionStatus:', err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   3. ANSWER MANAGEMENT
================================ */
export const getAllAnswers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.content = new RegExp(search, 'i');

    const answers = await Answer.find(filter)
      .populate('author', 'username email')
      .populate('question', 'title')
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnswerAdmin = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    await answer.deleteOne();

    await logAction(
      'DELETE_ANSWER',
      answer._id,
      'Answer',
      req.body.reason || 'Not specified',
      req.user.id
    );

    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    console.error('Error in deleteAnswerAdmin:', err);
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   5. TAG MANAGEMENT
================================ */


export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }); 
    res.json(tags);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ message: err.message });
  }
};



export const createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   6. ANALYTICS
================================ */
export const getAnalytics = async (req, res) => {
  try {
    console.log('get analytics called')
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();
    const activeUsers = await User.countDocuments({ isBanned: false });
    const tagsUsage = await Question.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },

  {
    $lookup: {
      from: 'tags',            
      localField: '_id',
      foreignField: '_id',
      as: 'tagInfo'
    }
  },

  { $unwind: '$tagInfo' },

  {
    $project: {
      _id: 1,                 
      name: '$tagInfo.name',
      count: 1
    }
  }
]);

    console.log(tagsUsage)

    res.json({
      totalUsers,
      totalQuestions,
      totalAnswers,
      activeUsers,
      mostUsedTags: tagsUsage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   7. ADMIN LOGS
================================ */
export const getAdminLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('performedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

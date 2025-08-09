// controllers/questionController.js
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';
import Log from "../models/Log.js"
import Answer from '../models/Answer.js'
import mongoose from 'mongoose';


export const getAllQuestions = async (req, res) => {
  try {
    
    const {
      keyword,
      user,
      status,
      sortBy,
      startDate,
      endDate,
      minVotes,
      maxVotes,
      page = 1,
      limit = 10
    } = req.query;
    const query = {};
    // Keyword search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    
    // Filter by user ID
    if (user) {
  try {
    query.author = new mongoose.Types.ObjectId(user);

  } catch (err) {
    console.warn('Invalid user ID passed, skipping author filter');
  }
}

  if (status) {
  query.status = status; // Assuming Question schema has a status field
}
    // Filter by answered status
    if (status) {
  const allowedStatuses = ['open', 'answered', 'closed'];
  if (allowedStatuses.includes(status)) {
    query.status = status;
  }
}

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Filter by vote count
    if (minVotes || maxVotes) {
      query.score = {};
      if (minVotes) query.score.$gte = parseInt(minVotes);
      if (maxVotes) query.score.$lte = parseInt(maxVotes);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    let sortCriteria = { createdAt: -1 };

if (sortBy === 'votes') {
  sortCriteria = { score: -1 };
}

if (sortBy === 'answers') {
  sortCriteria = { createdAt: -1 }; 
}

if (sortBy === 'trending') {
  sortCriteria = { score: -1 }; 
}

if (sortBy === 'oldest') {
  sortCriteria = { createdAt: 1 }; 
}

    // Query DB
    let questions = await Question.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar') 
      .populate('tags', 'name')          
      .lean(); 

    // Add computed fields (like answerCount, upvote/downvote counts)
    const questionIds = questions.map(q => q._id);
    const answerCounts = await Answer.aggregate([
      { $match: { question: { $in: questionIds } } },
      { $group: { _id: '$question', count: { $sum: 1 } } }
    ]);

    const answerCountMap = {};
    answerCounts.forEach(item => {
      answerCountMap[item._id.toString()] = item.count;
    });

    // Attach additional info to each question
    questions = questions.map(q => ({
      ...q,
      upvoteCount: q.upvotes?.length || 0,
      downvoteCount: q.downvotes?.length || 0,
      answerCount: answerCountMap[q._id.toString()] || 0
    }));

    const total = await Question.countDocuments(query);
    res.status(200).json({
      questions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
};


// Create question
export const askQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Ensure tags is an array
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array of strings' });
    }

    // Process tags: find or create them
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName });

        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }

        return tag._id;
      })
    );

    // Create question with tag ObjectIds
    const question = await Question.create({
      author: req.user.id,
      title,
      description,
      tags: tagIds,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get single question with details
export const getQuestionDetails = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('tags', 'name');

    if (!question) return res.status(404).json({ message: 'Question not found' });

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit question
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, tags } = req.body;

    // Update title & description
    question.title = title || question.title;
    question.description = description || question.description;

    // Update tags (if provided)
    if (tags && Array.isArray(tags)) {
      const tagIds = [];

      for (const tagName of tags) {
        let tag = await Tag.findOne({ name: tagName });

        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }

        tagIds.push(tag._id);
      }

      question.tags = tagIds;
    }

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Update question error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    console.log(question)
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await question.deleteOne();

    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markQuestionStatus = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const { status } = req.body;
    if (!['open', 'answered', 'closed'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    question.status = status;
    await question.save();

    res.json({ status: question.status }); // ✅ Return status
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// controllers/questionController.js
export const searchQuestions = async (req, res) => {
  try {
    const { keyword, dateFrom, dateTo, minVotes, answered, userId, page = 1, limit = 10, sortBy = 'relevance' } = req.query;

    const filter = {};
    const sort = {};

    if (keyword) {
      filter.$text = { $search: keyword };
      sort.score = { $meta: 'textScore' }; // Sort by relevance
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (minVotes) {
      filter.votes = { $gte: parseInt(minVotes) };
    }

    if (answered === 'true') {
      filter.answerCount = { $gt: 0 };
    } else if (answered === 'false') {
      filter.answerCount = 0;
    }

    if (userId) {
      filter.user = userId;
    }

    // Fallback sorting if not sorting by relevance
    if (!keyword || sortBy === 'newest') {
      sort.createdAt = -1;
    } else if (sortBy === 'votes') {
      sort.votes = -1;
    } else if (sortBy === 'answers') {
      sort.answerCount = -1;
    }

    const questions = await Question.find(filter, keyword ? { score: { $meta: 'textScore' } } : {})
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name reputation')
      .lean();

    const total = await Question.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching questions' });
  }
};


export const deleteQuestionAdmin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    await question.deleteOne();

    // Save log
    await Log.create({
      action: 'DELETE_QUESTION',
      targetId: question._id,
      targetModel: 'Question',
      reason: req.body.reason || 'Spam or offensive content',
      performedBy: req.user._id,
    });

    res.json({ message: 'Question deleted and logged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/answerController.js
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import Log from "../models/Log.js"

export const createAnswer = async (req, res) => {
  try {
    console.log("create answer called")
    const { questionId, content } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    console.log("question found")
    const answer = new Answer({
      question: questionId,
      author: req.user.id,
      content,
    });
    console.log(answer)
    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    answer.content = req.body.content || answer.content;
    await answer.save();

    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await answer.deleteOne();
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const markBestAnswer = async (req, res) => {
  try {
    console.log("mark best answer called")
    const answer = await Answer.findById(req.params.id).populate('question');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (answer.question.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only question author can mark best answer' });

    await Answer.updateMany(
      { question: answer.question._id, isBestAnswer: true },
      { isBestAnswer: false }
    );

    answer.isBestAnswer = true;
    await answer.save();

    res.json({ message: 'Marked as best answer', answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addCommentToAnswer = async (req, res) => {
  try {
    console.log('add answer called')
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    answer.comments.push({
      author: req.user.id,
      content: req.body.content
    });

    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnswerAdmin = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    await answer.deleteOne();

    await Log.create({
      action: 'DELETE_ANSWER',
      targetId: answer._id,
      targetModel: 'Answer',
      reason: req.body.reason || 'Spam or offensive content',
      performedBy: req.user._id,
    });

    res.json({ message: 'Answer deleted and logged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnswersForQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id })
      .populate('author', 'username avatar _id') 
      .populate({
        path: 'comments.author',   
        select: 'username avatar _id',
      })
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAnswerById = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id)
      .populate("question", "title _id") 
      .populate("author", "name avatar") 
      .populate("comments.author", "name avatar");

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error fetching answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
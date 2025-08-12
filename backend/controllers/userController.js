import User  from '../models/User.js';

import mongoose from 'mongoose';

const userSelectFields = '_id username email avatar reputation role isVerified isBanned createdAt updatedAt';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUserDetails = async (req, res) => {
  try {
    const id = req.user?.id;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id).select(userSelectFields);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id',id)
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Select fewer fields if exposing public profile
    const publicProfileFields = '_id username email avatar isBanned reputation createdAt isVerified';

    const user = await User.findById(id).select(publicProfileFields);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || user.username;
    user.avatar = req.body.avatar || user.avatar;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      reputation: updatedUser.reputation
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = true; // You can add `isBanned` to the User model if needed
    await user.save();

    res.json({ message: 'User has been banned' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

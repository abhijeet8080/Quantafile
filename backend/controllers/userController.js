import User  from '../models/User.js';

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format (optional but good practice)
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      reputation: user.reputation,
      role: user.role,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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

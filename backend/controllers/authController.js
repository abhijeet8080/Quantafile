import User from '../models/User.js';
import generateToken from '../utils/generateToken.js'
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const { username, email, password, avatar } = req.body;
  
  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }
    
    if (user && !user.isVerified) {
      
      user.username = username;
      user.password = password;
      user.avatar = avatar;
      await user.save();
    } else {
      
      user = await User.create({ username, email, password, avatar });
    }

    const token = generateToken(user)

    const verificationUrl = `${process.env.BACKEND_URL}/verify-email/${token}`;
    const htmlBody = `
      <p>Hello ${user.username},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      htmlBody
    });

    res.status(201).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    const token = generateToken(user);
   
    res.status(200).json({ token, user: { _id: user._id, username: user.username, email: user.email,avatar:user.avatar,role:user.role,isVerified:user.isVerified,isBanned:user.isBanned } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    await user.save();
    const newToken = generateToken(user);
    return res.status(200).json({ message: 'Email verified successfully.',token:newToken,user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    isBanned:user.isBanned
  } });
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};


export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) 
  });

  res.status(200).json({ message: 'Logged out successfully.' });
};

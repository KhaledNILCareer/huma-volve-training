import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';


export const register = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ success: false, errors });
    } else if (err.code === 11000) {
      res.status(400).json({ success: false, errors: ['Email already exists'] });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'Access token refreshed' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json({ success: true, message: 'User deleted' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  age: { type: Number }
});

const User = mongoose.model('User', userSchema);

export default User;
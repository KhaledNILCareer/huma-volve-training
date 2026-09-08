import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', createUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

export default router;
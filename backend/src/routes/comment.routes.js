import express from 'express';
import {
  getCommentsByNewsId,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUserId,
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsByNewsIdSchema,
} from '../validators/comment.validator.js';

const router = express.Router();

// Public routes
router.get('/news/:newsId', validate(getCommentsByNewsIdSchema), getCommentsByNewsId);
router.get('/user/:userId', getCommentsByUserId);

// Protected routes
router.post('/news/:newsId', protect, validate(createCommentSchema), createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, validate(deleteCommentSchema), deleteComment);

export default router;

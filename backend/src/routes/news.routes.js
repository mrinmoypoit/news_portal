import express from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getNewsByAuthor,
} from '../controllers/news.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createNewsSchema,
  updateNewsSchema,
  getNewsByIdSchema,
  deleteNewsSchema,
  getAllNewsSchema,
} from '../validators/news.validator.js';

const router = express.Router();

// Public routes
router.get('/', validate(getAllNewsSchema), getAllNews);
router.get('/:id', validate(getNewsByIdSchema), getNewsById);
router.get('/author/:authorId', getNewsByAuthor);

// Protected routes
router.post('/', protect, validate(createNewsSchema), createNews);
router.put('/:id', protect, validate(updateNewsSchema), updateNews);
router.delete('/:id', protect, validate(deleteNewsSchema), deleteNews);

export default router;

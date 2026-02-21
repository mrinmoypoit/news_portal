import asyncHandler from 'express-async-handler';
import prisma from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Get all comments for a news article
 * @route   GET /api/comments/news/:newsId
 * @access  Public
 */
export const getCommentsByNewsId = asyncHandler(async (req, res) => {
  const { newsId } = req.params;

  // Check if news exists
  const newsExists = await prisma.news.findUnique({
    where: { id: parseInt(newsId) },
  });

  if (!newsExists) {
    throw new ApiError(404, 'News not found');
  }

  const comments = await prisma.comment.findMany({
    where: { newsId: parseInt(newsId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

/**
 * @desc    Create a comment on a news article
 * @route   POST /api/comments/news/:newsId
 * @access  Private
 */
export const createComment = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  // Check if news exists
  const newsExists = await prisma.news.findUnique({
    where: { id: parseInt(newsId) },
  });

  if (!newsExists) {
    throw new ApiError(404, 'News not found');
  }

  const comment = await prisma.comment.create({
    data: {
      text,
      newsId: parseInt(newsId),
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, comment, 'Comment created successfully'));
});

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private (Comment author only)
 */
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  // Check if comment exists
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingComment) {
    throw new ApiError(404, 'Comment not found');
  }

  // Check authorization (only comment author can update)
  if (existingComment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this comment');
  }

  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { text },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, comment, 'Comment updated successfully'));
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment author or Admin)
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if comment exists
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingComment) {
    throw new ApiError(404, 'Comment not found');
  }

  // Check authorization (comment author or admin)
  if (existingComment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to delete this comment');
  }

  await prisma.comment.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
});

/**
 * @desc    Get all comments by a user
 * @route   GET /api/comments/user/:userId
 * @access  Public
 */
export const getCommentsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const comments = await prisma.comment.findMany({
    where: { userId: parseInt(userId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      news: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

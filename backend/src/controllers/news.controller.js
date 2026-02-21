import asyncHandler from 'express-async-handler';
import prisma from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Get all news with pagination and search
 * @route   GET /api/news
 * @access  Public
 */
export const getAllNews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause for search
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  // Get total count
  const total = await prisma.news.count({ where });

  // Get news with author and comments count
  const news = await prisma.news.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        news,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      'News retrieved successfully'
    )
  );
});

/**
 * @desc    Get single news by ID
 * @route   GET /api/news/:id
 * @access  Public
 */
export const getNewsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const news = await prisma.news.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
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
      },
    },
  });

  if (!news) {
    throw new ApiError(404, 'News not found');
  }

  res.status(200).json(new ApiResponse(200, news, 'News retrieved successfully'));
});

/**
 * @desc    Create new news
 * @route   POST /api/news
 * @access  Private
 */
export const createNews = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  const authorId = req.user.id;

  const news = await prisma.news.create({
    data: {
      title,
      body,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, news, 'News created successfully'));
});

/**
 * @desc    Update news
 * @route   PUT /api/news/:id
 * @access  Private (Author or Admin)
 */
export const updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  // Check if news exists
  const existingNews = await prisma.news.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingNews) {
    throw new ApiError(404, 'News not found');
  }

  // Check authorization (author or admin)
  if (existingNews.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this news');
  }

  // Update news
  const updateData = {};
  if (title) updateData.title = title;
  if (body) updateData.body = body;

  const news = await prisma.news.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, news, 'News updated successfully'));
});

/**
 * @desc    Delete news
 * @route   DELETE /api/news/:id
 * @access  Private (Author or Admin)
 */
export const deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if news exists
  const existingNews = await prisma.news.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingNews) {
    throw new ApiError(404, 'News not found');
  }

  // Check authorization (author or admin)
  if (existingNews.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to delete this news');
  }

  // Delete news (comments will be deleted automatically due to cascade)
  await prisma.news.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json(new ApiResponse(200, null, 'News deleted successfully'));
});

/**
 * @desc    Get news by author
 * @route   GET /api/news/author/:authorId
 * @access  Public
 */
export const getNewsByAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const news = await prisma.news.findMany({
    where: { authorId: parseInt(authorId) },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, news, 'News retrieved successfully'));
});

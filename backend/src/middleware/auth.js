import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import ApiError from '../utils/ApiError.js';

/**
 * Protect routes - Verify JWT token and authenticate user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (exclude password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    throw error;
  }
});

/**
 * Admin authorization middleware
 * Must be used after protect middleware
 */
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as admin');
  }
});

/**
 * Optional authentication - Attach user if token exists but don't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      req.user = user;
    } catch (error) {
      // Token invalid but continue anyway
      req.user = null;
    }
  }

  next();
});

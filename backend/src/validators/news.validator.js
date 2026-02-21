import { z } from 'zod';

// Create news validation schema
export const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    body: z.string().min(10, 'Content must be at least 10 characters'),
  }),
});

// Update news validation schema
export const updateNewsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid news ID'),
  }),
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200).optional(),
    body: z.string().min(10, 'Content must be at least 10 characters').optional(),
  }),
});

// Get news by ID validation schema
export const getNewsByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid news ID'),
  }),
});

// Delete news validation schema
export const deleteNewsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid news ID'),
  }),
});

// Get all news with pagination
export const getAllNewsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    search: z.string().optional(),
  }),
});

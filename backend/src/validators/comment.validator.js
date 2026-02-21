import { z } from 'zod';

// Create comment validation schema
export const createCommentSchema = z.object({
  params: z.object({
    newsId: z.string().regex(/^\d+$/, 'Invalid news ID'),
  }),
  body: z.object({
    text: z.string().min(1, 'Comment text is required').max(1000),
  }),
});

// Delete comment validation schema
export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid comment ID'),
  }),
});

// Get comments by news ID
export const getCommentsByNewsIdSchema = z.object({
  params: z.object({
    newsId: z.string().regex(/^\d+$/, 'Invalid news ID'),
  }),
});

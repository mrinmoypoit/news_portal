import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import newsRoutes from './routes/news.routes.js';
import commentRoutes from './routes/comment.routes.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'News Portal API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      news: '/api/news',
      comments: '/api/comments',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;

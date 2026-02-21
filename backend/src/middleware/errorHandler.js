import ApiError from '../utils/ApiError.js';

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate field value: ${err.meta?.target?.join(', ')}`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference - related record not found';
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation error';
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Development vs Production error response
  const response = {
    success: false,
    statusCode,
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  console.error('Error:', {
    message: err.message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json(response);
};

export default errorHandler;

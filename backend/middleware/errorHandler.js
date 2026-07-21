export const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error Log:', err.stack);

  // PostgreSQL unique constraint violation (e.g. duplicate email)
  if (err.code === '23505') {
    return res.status(400).json({
      status: 'fail',
      message: 'A record with this information already exists.',
    });
  }

  // General error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'An unexpected server error occurred.',
  });
};
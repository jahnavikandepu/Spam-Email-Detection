/**
 * Centralized Error Handling Middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err.stack || err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 
    ? res.statusCode 
    : (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
};

export default errorHandler;

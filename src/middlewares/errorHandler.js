/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send error response to client
  res.status(statusCode).json({
    success: false,
    error: message,
    details: err.unavailableProducts || err.details || null,
  });
}

module.exports = errorHandler;

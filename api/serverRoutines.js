const logger = require('./middleware/logger');

/**
 * Server Routines
 * Background tasks and scheduled operations
 */

// Example: Cleanup expired tokens every hour
const cleanupExpiredTokens = async () => {
  try {
    const Token = require('./models/Token');
    // Mongoose will automatically delete expired tokens
    // based on the 'expires' field in the schema
    logger.routineStart('Token cleanup');
    // Add custom cleanup logic if needed
    logger.info('Token cleanup completed');
  } catch (error) {
    logger.routineError('Token cleanup', error);
  }
};

// Run cleanup every hour
const HOUR = 60 * 60 * 1000;
setInterval(cleanupExpiredTokens, HOUR);

// Initial run
cleanupExpiredTokens();

logger.info('Server routines initialized');

module.exports = {
  cleanupExpiredTokens
};

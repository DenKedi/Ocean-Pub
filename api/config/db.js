const mongoose = require('mongoose');
const logger = require('../middleware/logger');

/**
 * Database Configuration
 * Handles MongoDB connection and events
 */

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    logger.dbConnect();

    // Connection events
    mongoose.connection.on('error', (err) => {
      logger.dbError(err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.dbError(error);
    process.exit(1);
  }
};

module.exports = connectDB;

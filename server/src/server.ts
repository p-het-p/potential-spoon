import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { testConnection, closePool } from './config/database.js';
import { initializeSocket } from './sockets/index.js';
import { paymentService } from './services/payments.service.js';
import logger from './utils/logger.js';

async function startServer() {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Create Express app
    const app = await createApp();

    // Create HTTP server (needed for Socket.IO)
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start expired order cleanup job (runs every 5 minutes)
    const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const cleanupTimer = setInterval(async () => {
      try {
        await paymentService.cleanupExpiredOrders();
      } catch (error) {
        logger.error('Expired order cleanup failed', error);
      }
    }, CLEANUP_INTERVAL);

    // Start server
    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API base path: ${env.API_BASE_PATH}`);
      logger.info(`Health check: http://localhost:${env.PORT}${env.API_BASE_PATH}/health`);
      logger.info('Socket.IO enabled');
      logger.info('Expired order cleanup job started (every 5 minutes)');
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      // Stop the cleanup timer
      clearInterval(cleanupTimer);

      server.close(async () => {
        logger.info('HTTP server closed');
        await closePool();
        logger.info('Shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();

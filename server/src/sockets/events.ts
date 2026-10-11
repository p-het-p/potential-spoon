import { Server as SocketIOServer, Socket } from 'socket.io';
import logger from '../utils/logger.js';

/**
 * Register socket event handlers for a connected client
 */
export function registerSocketEvents(_io: SocketIOServer, socket: Socket) {
  // Client can join an order room to receive real-time updates
  socket.on('join:order', (data: { order_id: number }) => {
    if (data.order_id) {
      socket.join(`order:${data.order_id}`);
      logger.debug('Socket joined order room', {
        socketId: socket.id,
        orderId: data.order_id,
      });
    }
  });

  // Client can join an event room for availability updates
  socket.on('join:event', (data: { event_id: number }) => {
    if (data.event_id) {
      socket.join(`event:${data.event_id}`);
      logger.debug('Socket joined event room', {
        socketId: socket.id,
        eventId: data.event_id,
      });
    }
  });

  // Client can leave rooms
  socket.on('leave:order', (data: { order_id: number }) => {
    if (data.order_id) {
      socket.leave(`order:${data.order_id}`);
    }
  });

  socket.on('leave:event', (data: { event_id: number }) => {
    if (data.event_id) {
      socket.leave(`event:${data.event_id}`);
    }
  });

  // Ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
}

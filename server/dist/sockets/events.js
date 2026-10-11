import logger from '../utils/logger.js';
/**
 * Register socket event handlers for a connected client
 */
export function registerSocketEvents(_io, socket) {
    // Client can join an order room to receive real-time updates
    socket.on('join:order', (data) => {
        if (data.order_id) {
            socket.join(`order:${data.order_id}`);
            logger.debug('Socket joined order room', {
                socketId: socket.id,
                orderId: data.order_id,
            });
        }
    });
    // Client can join an event room for availability updates
    socket.on('join:event', (data) => {
        if (data.event_id) {
            socket.join(`event:${data.event_id}`);
            logger.debug('Socket joined event room', {
                socketId: socket.id,
                eventId: data.event_id,
            });
        }
    });
    // Client can leave rooms
    socket.on('leave:order', (data) => {
        if (data.order_id) {
            socket.leave(`order:${data.order_id}`);
        }
    });
    socket.on('leave:event', (data) => {
        if (data.event_id) {
            socket.leave(`event:${data.event_id}`);
        }
    });
    // Ping/pong for connection health
    socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
    });
}
//# sourceMappingURL=events.js.map
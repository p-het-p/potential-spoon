import { eventRepository } from '../repositories/event.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
export class EventService {
    async getEvents(filters) {
        const { events, total } = await eventRepository.findAll(filters);
        return {
            events: events.map((event) => ({
                id: event.id,
                title: event.title,
                description: event.description,
                venue: event.venue,
                starts_at: event.starts_at,
                ends_at: event.ends_at,
                capacity: event.capacity,
                is_public: event.is_public,
            })),
            pagination: {
                page: filters.page,
                limit: filters.limit,
                total,
            },
        };
    }
    async getEventById(id) {
        const event = await eventRepository.findById(id);
        if (!event) {
            throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found');
        }
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            venue: event.venue,
            starts_at: event.starts_at,
            ends_at: event.ends_at,
            capacity: event.capacity,
            is_public: event.is_public,
            created_by: event.created_by,
            created_at: event.created_at,
        };
    }
    async createEvent(input) {
        const event = await eventRepository.create(input);
        logger.info('Event created', { eventId: event.id, title: event.title });
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            venue: event.venue,
            starts_at: event.starts_at,
            ends_at: event.ends_at,
            capacity: event.capacity,
            is_public: event.is_public,
            created_by: event.created_by,
            created_at: event.created_at,
        };
    }
    async updateEvent(id, updates) {
        const existingEvent = await eventRepository.findById(id);
        if (!existingEvent) {
            throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found');
        }
        const event = await eventRepository.update(id, updates);
        logger.info('Event updated', { eventId: event.id });
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            venue: event.venue,
            starts_at: event.starts_at,
            ends_at: event.ends_at,
            capacity: event.capacity,
            is_public: event.is_public,
            created_by: event.created_by,
            created_at: event.created_at,
        };
    }
    async deleteEvent(id) {
        const existingEvent = await eventRepository.findById(id);
        if (!existingEvent) {
            throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found');
        }
        await eventRepository.delete(id);
        logger.info('Event deleted', { eventId: id });
    }
}
export const eventService = new EventService();
//# sourceMappingURL=event.service.js.map
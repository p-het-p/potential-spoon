import { CreateEventInput, UpdateEventInput } from '../repositories/event.repository.js';
export declare class EventService {
    getEvents(filters: {
        page: number;
        limit: number;
        search?: string;
        userRole?: string;
    }): Promise<{
        events: {
            id: number;
            title: string;
            description: string | null;
            venue: string | null;
            starts_at: Date;
            ends_at: Date | null;
            capacity: number;
            is_public: boolean;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getEventById(id: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        venue: string | null;
        starts_at: Date;
        ends_at: Date | null;
        capacity: number;
        is_public: boolean;
        created_by: string | null;
        created_at: Date;
    }>;
    createEvent(input: CreateEventInput): Promise<{
        id: number;
        title: string;
        description: string | null;
        venue: string | null;
        starts_at: Date;
        ends_at: Date | null;
        capacity: number;
        is_public: boolean;
        created_by: string | null;
        created_at: Date;
    }>;
    updateEvent(id: number, updates: UpdateEventInput): Promise<{
        id: number;
        title: string;
        description: string | null;
        venue: string | null;
        starts_at: Date;
        ends_at: Date | null;
        capacity: number;
        is_public: boolean;
        created_by: string | null;
        created_at: Date;
    }>;
    deleteEvent(id: number): Promise<void>;
}
export declare const eventService: EventService;
//# sourceMappingURL=event.service.d.ts.map
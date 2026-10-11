export interface Event {
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
}
export interface CreateEventInput {
    title: string;
    description?: string;
    venue?: string;
    starts_at: Date;
    ends_at?: Date;
    capacity: number;
    is_public: boolean;
    created_by: string;
}
export interface UpdateEventInput {
    title?: string;
    description?: string;
    venue?: string;
    starts_at?: Date;
    ends_at?: Date;
    capacity?: number;
    is_public?: boolean;
}
export declare class EventRepository {
    findAll(filters: {
        page: number;
        limit: number;
        search?: string;
        userRole?: string;
    }): Promise<{
        events: Event[];
        total: number;
    }>;
    findById(id: number): Promise<Event | null>;
    create(input: CreateEventInput): Promise<Event>;
    update(id: number, updates: UpdateEventInput): Promise<Event>;
    delete(id: number): Promise<void>;
}
export declare const eventRepository: EventRepository;
//# sourceMappingURL=event.repository.d.ts.map
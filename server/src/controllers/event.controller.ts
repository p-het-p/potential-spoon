import { Request, Response } from 'express';
import { eventService } from '../services/event.service.js';

export class EventController {
  async getEvents(req: Request, res: Response): Promise<void> {
    const { page, limit, search } = req.query;

    const result = await eventService.getEvents({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search: search as string,
      userRole: req.user?.role,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const event = await eventService.getEventById(Number(id));

    res.status(200).json({
      success: true,
      data: event,
    });
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    const { title, description, venue, starts_at, ends_at, capacity, is_public } = req.body;
    const created_by = req.user!.userId;

    const event = await eventService.createEvent({
      title,
      description,
      venue,
      starts_at: new Date(starts_at),
      ends_at: ends_at ? new Date(ends_at) : undefined,
      capacity,
      is_public: is_public !== undefined ? is_public : true,
      created_by,
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully',
    });
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, description, venue, starts_at, ends_at, capacity, is_public } = req.body;

    const event = await eventService.updateEvent(Number(id), {
      title,
      description,
      venue,
      starts_at: starts_at ? new Date(starts_at) : undefined,
      ends_at: ends_at ? new Date(ends_at) : undefined,
      capacity,
      is_public,
    });

    res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully',
    });
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await eventService.deleteEvent(Number(id));

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  }
}

export const eventController = new EventController();

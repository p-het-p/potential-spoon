import { Request, Response } from 'express';
import * as leaderRepository from '../repositories/leader.repository.js';
import * as leaderSchemas from '../schemas/leader.schema.js';
import logger from '../utils/logger.js';

// --- Fundraisers ---

export async function createFundraiser(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.fundraiserSchema.parse(req.body);
    const fundraiser = await leaderRepository.createFundraiser(validatedData);
    return res.status(201).json(fundraiser);
  } catch (error: any) {
    logger.error('Error creating fundraiser:', error);
    return res.status(400).json({ error: error.errors || 'Failed to create fundraiser' });
  }
}

export async function getFundraisers(_req: Request, res: Response) {
  try {
    const fundraisers = await leaderRepository.getFundraisers();
    return res.status(200).json(fundraisers);
  } catch (error: any) {
    logger.error('Error getting fundraisers:', error);
    return res.status(500).json({ error: 'Failed to retrieve fundraisers' });
  }
}

export async function updateFundraiser(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.updateFundraiserSchema.parse(req.body);
    const updated = await leaderRepository.updateFundraiser(req.params.id, validatedData);
    if (!updated) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }
    return res.status(200).json(updated);
  } catch (error: any) {
    logger.error('Error updating fundraiser:', error);
    return res.status(400).json({ error: error.errors || 'Failed to update fundraiser' });
  }
}

export async function deleteFundraiser(req: Request, res: Response) {
  try {
    const deleted = await leaderRepository.deleteFundraiser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }
    return res.status(200).json({ message: 'Fundraiser deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting fundraiser:', error);
    return res.status(500).json({ error: 'Failed to delete fundraiser' });
  }
}

// --- Volunteer Tasks ---

export async function createVolunteerTask(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.volunteerTaskSchema.parse(req.body);
    const task = await leaderRepository.createVolunteerTask(validatedData);
    return res.status(201).json(task);
  } catch (error: any) {
    logger.error('Error creating volunteer task:', error);
    return res.status(400).json({ error: error.errors || 'Failed to create task' });
  }
}

export async function getVolunteerTasks(_req: Request, res: Response) {
  try {
    const tasks = await leaderRepository.getVolunteerTasks();
    return res.status(200).json(tasks);
  } catch (error: any) {
    logger.error('Error getting volunteer tasks:', error);
    return res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
}

export async function updateVolunteerTask(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.updateVolunteerTaskSchema.parse(req.body);
    const updated = await leaderRepository.updateVolunteerTask(req.params.id, validatedData);
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json(updated);
  } catch (error: any) {
    logger.error('Error updating volunteer task:', error);
    return res.status(400).json({ error: error.errors || 'Failed to update task' });
  }
}

export async function deleteVolunteerTask(req: Request, res: Response) {
  try {
    const deleted = await leaderRepository.deleteVolunteerTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting volunteer task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}

// --- Announcements ---

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.announcementSchema.parse(req.body);
    const author_id = (req as any).user?.user_id; // Using user_id from auth token
    const announcement = await leaderRepository.createAnnouncement({ ...validatedData, author_id });
    return res.status(201).json(announcement);
  } catch (error: any) {
    logger.error('Error creating announcement:', error);
    return res.status(400).json({ error: error.errors || 'Failed to create announcement' });
  }
}

export async function getAnnouncements(_req: Request, res: Response) {
  try {
    const announcements = await leaderRepository.getAnnouncements();
    return res.status(200).json(announcements);
  } catch (error: any) {
    logger.error('Error getting announcements:', error);
    return res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
}

export async function updateAnnouncement(req: Request, res: Response) {
  try {
    const validatedData = leaderSchemas.updateAnnouncementSchema.parse(req.body);
    const updated = await leaderRepository.updateAnnouncement(req.params.id, validatedData);
    if (!updated) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    return res.status(200).json(updated);
  } catch (error: any) {
    logger.error('Error updating announcement:', error);
    return res.status(400).json({ error: error.errors || 'Failed to update announcement' });
  }
}

export async function deleteAnnouncement(req: Request, res: Response) {
  try {
    const deleted = await leaderRepository.deleteAnnouncement(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting announcement:', error);
    return res.status(500).json({ error: 'Failed to delete announcement' });
  }
}

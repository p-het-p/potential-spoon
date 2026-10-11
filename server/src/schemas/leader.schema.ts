import { z } from 'zod';

export const fundraiserSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  goal_amount: z.number().min(0).default(0),
  current_amount: z.number().min(0).default(0),
  status: z.enum(['planning', 'active', 'completed']).default('planning'),
});

export const updateFundraiserSchema = fundraiserSchema.partial();

export const volunteerTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  fundraiser_id: z.string().uuid().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'declined']).default('pending'),
  decline_reason: z.string().optional().nullable(),
});

export const updateVolunteerTaskSchema = volunteerTaskSchema.partial();

export const taskExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  receipt_url: z.string().optional().nullable(),
});


export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  audience: z.enum(['all', 'members']).default('all'),
});

export const updateAnnouncementSchema = announcementSchema.partial();

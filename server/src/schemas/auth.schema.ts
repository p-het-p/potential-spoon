import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    full_name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(150, 'Name must not exceed 150 characters'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format')
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(150, 'Name must not exceed 150 characters')
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format')
      .optional(),
  }),
});

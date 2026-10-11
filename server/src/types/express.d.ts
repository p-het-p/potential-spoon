import { UserRole } from './index.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
      guest?: {
        attendeeId: number;
        email: string;
        sessionId: string;
      };
    }
  }
}

export {};

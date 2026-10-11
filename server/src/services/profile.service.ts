import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

export interface UpdateProfileInput {
  full_name?: string;
  phone?: string;
}

export class ProfileService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    };
  }

  async updateProfile(userId: string, updates: UpdateProfileInput) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    const updatedUser = await userRepository.update(userId, updates);

    logger.info('Profile updated', { userId });

    return {
      user_id: updatedUser.user_id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone,
      role: updatedUser.role,
    };
  }
}

export const profileService = new ProfileService();

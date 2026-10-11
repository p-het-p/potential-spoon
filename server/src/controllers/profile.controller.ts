import { Request, Response } from 'express';
import { profileService } from '../services/profile.service.js';

export class ProfileController {
  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const profile = await profileService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { full_name, phone } = req.body;

    const profile = await profileService.updateProfile(userId, {
      full_name,
      phone,
    });

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    });
  }
}

export const profileController = new ProfileController();

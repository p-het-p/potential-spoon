import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, full_name, phone } = req.body;

    const result = await authService.register({
      email,
      password,
      full_name,
      phone,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful',
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await authService.login({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // In a stateless JWT system, logout is handled client-side by discarding the token
    // For production, you might want to implement a token blacklist
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export const authController = new AuthController();

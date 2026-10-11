import { Request, Response } from 'express';
import { orderService } from '../services/orders.service.js';

export class OrderController {
  async getOrders(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;
    const { page, limit, status } = req.query as any;

    const result = await orderService.getUserOrders({ userId, attendeeId }, {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;
    const role = req.user?.role;
    const orderId = Number(req.params.orderId);

    const order = await orderService.getOrderById(orderId, userId, role, attendeeId);

    res.status(200).json({
      success: true,
      data: order,
    });
  }
}

export const orderController = new OrderController();

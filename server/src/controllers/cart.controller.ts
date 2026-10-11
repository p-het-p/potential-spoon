import { Request, Response } from 'express';
import { cartService } from '../services/cart.service.js';

export class CartController {
  async getCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;

    const cart = await cartService.getCart({ userId, attendeeId });

    res.status(200).json({
      success: true,
      data: cart,
    });
  }

  async addItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;
    const { product_id, quantity } = req.body;

    const item = await cartService.addItem({
      userId,
      attendeeId,
      productId: product_id,
      quantity,
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Item added to cart',
    });
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    const item = await cartService.updateItemQuantity({
      userId,
      attendeeId,
      cartItemId,
      quantity,
    });

    res.status(200).json({
      success: true,
      data: item,
      message: 'Cart item updated',
    });
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const attendeeId = req.guest?.attendeeId;
    const cartItemId = Number(req.params.cartItemId);

    await cartService.removeItem({ userId, attendeeId, cartItemId });

    res.status(204).send();
  }
}

export const cartController = new CartController();

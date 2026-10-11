import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';

export class ProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    const { type, event_id } = req.query;

    const result = await productService.getProducts({
      type: type as string,
      event_id: event_id ? Number(event_id) : undefined,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));

    res.status(200).json({
      success: true,
      data: product,
    });
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.updateProduct(Number(id), req.body);
    res.status(200).json({
      success: true,
      data: product,
    });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  }
}

export const productController = new ProductController();

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler.js';

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(
          400,
          'VALIDATION_ERROR',
          'The supplied request is invalid',
          error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        ));
        return;
      }
      next(error);
    }
  };
}


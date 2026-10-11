import { ZodError } from 'zod';
import { AppError } from './errorHandler.js';
export function validate(schema) {
    return (req, _res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(new AppError(400, 'VALIDATION_ERROR', 'The supplied request is invalid', error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }))));
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map
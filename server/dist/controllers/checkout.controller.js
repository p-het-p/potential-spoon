import { checkoutService } from '../services/checkout.service.js';
export class CheckoutController {
    async preview(req, res) {
        const userId = req.user?.userId;
        const attendeeId = req.guest?.attendeeId;
        const result = await checkoutService.preview({ userId, attendeeId });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    async checkout(req, res) {
        const userId = req.user?.userId;
        const attendeeId = req.guest?.attendeeId;
        const result = await checkoutService.checkout({ userId, attendeeId, paymentMethod: req.body.payment_method });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
}
export const checkoutController = new CheckoutController();
//# sourceMappingURL=checkout.controller.js.map
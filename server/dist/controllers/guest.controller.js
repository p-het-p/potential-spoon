import { guestService } from '../services/guest.service.js';
export class GuestController {
    async register(req, res) {
        const { full_name, email, phone } = req.body;
        const result = await guestService.register({ full_name, email, phone });
        res.status(201).json({
            success: true,
            data: result,
            message: 'Guest registered successfully',
        });
    }
    async sendOtp(req, res) {
        const { attendee_id } = req.body;
        await guestService.sendOtp(attendee_id);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });
    }
    async verifyOtp(req, res) {
        const { attendee_id, otp } = req.body;
        const result = await guestService.verifyOtp(attendee_id, otp);
        // Set session token as httpOnly cookie
        res.cookie('guest_session', result.session_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
}
export const guestController = new GuestController();
//# sourceMappingURL=guest.controller.js.map
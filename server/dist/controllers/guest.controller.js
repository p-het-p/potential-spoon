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
        const { attendee_id, email } = req.body;
        const result = await guestService.sendOtp(attendee_id, email);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: {
                otp: result.otp,
                attendee_id: result.attendee_id,
            },
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
    async getPass(req, res) {
        const attendeeId = req.guest?.attendeeId || Number(req.query.attendee_id);
        if (!attendeeId) {
            res.status(400).json({ success: false, message: 'Attendee ID is required' });
            return;
        }
        const result = await guestService.getPass(attendeeId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
}
export const guestController = new GuestController();
//# sourceMappingURL=guest.controller.js.map
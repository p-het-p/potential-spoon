import { membershipService } from '../services/membership.service.js';
export class MembershipController {
    async getMembershipPlans(_req, res) {
        const result = await membershipService.getMembershipPlans();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    async getUserMembership(req, res) {
        const userId = req.user.userId;
        const membership = await membershipService.getUserMembership(userId);
        if (!membership) {
            res.status(200).json({
                success: true,
                data: null,
                message: 'No active membership found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: membership,
        });
    }
    async createMembership(req, res) {
        const userId = req.user.userId;
        const { plan_id, student_id, department } = req.body;
        const result = await membershipService.createMembership({
            userId,
            planId: plan_id,
            studentId: student_id,
            department,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: 'Membership created successfully',
        });
    }
}
export const membershipController = new MembershipController();
//# sourceMappingURL=membership.controller.js.map
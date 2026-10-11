import { membershipRepository } from '../repositories/membership.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

export class MembershipService {
  async getMembershipPlans() {
    const plans = await membershipRepository.findAllPlans();

    return {
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        dues_amount: plan.dues_amount,
        duration_days: plan.duration_days,
        is_active: plan.is_active,
      })),
    };
  }

  async getUserMembership(userId: string) {
    const membership = await membershipRepository.findActiveMembershipByUserId(userId);

    if (!membership) {
      return null;
    }

    return {
      id: membership.id,
      status: membership.status,
      plan_name: (membership as any).plan_name,
      start_date: membership.start_date,
      end_date: membership.end_date,
      student_id: membership.student_id,
      department: membership.department,
    };
  }

  async createMembership(input: {
    userId: string;
    planId: number;
    studentId?: string;
    department?: string;
  }) {
    // Check if user already has an active/pending membership
    const existingMembership = await membershipRepository.findActiveMembershipByUserId(input.userId);
    if (existingMembership) {
      throw new AppError(409, 'MEMBERSHIP_EXISTS', 'User already has an active or pending membership');
    }

    // Check if plan exists and is active
    const plan = await membershipRepository.findPlanById(input.planId);
    if (!plan || !plan.is_active) {
      throw new AppError(404, 'PLAN_NOT_FOUND', 'Membership plan not found or inactive');
    }

    const membership = await membershipRepository.createMembership({
      user_id: input.userId,
      plan_id: input.planId,
      student_id: input.studentId,
      department: input.department,
    });

    logger.info('Membership created', { membershipId: membership.id, userId: input.userId });

    return {
      membership_id: membership.id,
      status: membership.status,
      plan_id: membership.plan_id,
      dues_amount: plan.dues_amount,
    };
  }

  async activateMembership(membershipId: number) {
    const membership = await membershipRepository.updateMembershipStatus(
      membershipId,
      'active',
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Default 1 year
    );

    logger.info('Membership activated', { membershipId });

    return membership;
  }
}

export const membershipService = new MembershipService();

import { query } from '../config/database.js';

export interface MembershipPlan {
  id: number;
  name: string;
  dues_amount: number;
  duration_days: number;
  is_active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Membership {
  id: number;
  user_id: string;
  plan_id: number;
  student_id: string | null;
  department: string | null;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
  registered_at: Date;
}

export class MembershipRepository {
  async findAllPlans(): Promise<MembershipPlan[]> {
    return await query<MembershipPlan>(
      'SELECT * FROM membership_plans WHERE is_active = true ORDER BY id'
    );
  }

  async findAllMemberships(): Promise<any[]> {
    return await query(
      `SELECT m.*, p.name as plan_name, u.full_name, u.email, u.phone
       FROM memberships m
       JOIN membership_plans p ON m.plan_id = p.id
       JOIN users u ON m.user_id = u.user_id
       ORDER BY m.registered_at DESC`
    );
  }

  async findPlanById(id: number): Promise<MembershipPlan | null> {
    const result = await query<MembershipPlan>(
      'SELECT * FROM membership_plans WHERE id = $1',
      [id]
    );
    return result[0] || null;
  }

  async findActiveMembershipByUserId(userId: string): Promise<Membership | null> {
    const result = await query<Membership>(
      `SELECT m.*, p.name as plan_name
       FROM memberships m
       JOIN membership_plans p ON m.plan_id = p.id
       WHERE m.user_id = $1 AND m.status IN ('active', 'pending')
       ORDER BY m.registered_at DESC
       LIMIT 1`,
      [userId]
    );
    return result[0] || null;
  }

  async createMembership(input: {
    user_id: string;
    plan_id: number;
    student_id?: string;
    department?: string;
  }): Promise<Membership> {
    const result = await query<Membership>(
      `INSERT INTO memberships (user_id, plan_id, student_id, department, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [input.user_id, input.plan_id, input.student_id || null, input.department || null]
    );
    return result[0];
  }

  async updateMembershipStatus(id: number, status: string, startDate?: Date, endDate?: Date): Promise<Membership> {
    const fields: string[] = ['status = $2'];
    const values: any[] = [id, status];
    let paramIndex = 3;

    if (startDate) {
      fields.push(`start_date = $${paramIndex++}`);
      values.push(startDate);
    }

    if (endDate) {
      fields.push(`end_date = $${paramIndex++}`);
      values.push(endDate);
    }

    const result = await query<Membership>(
      `UPDATE memberships SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    return result[0];
  }
}

export const membershipRepository = new MembershipRepository();

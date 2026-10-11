import { query } from '../config/database.js';
export class MembershipRepository {
    async findAllPlans() {
        return await query('SELECT * FROM membership_plans WHERE is_active = true ORDER BY id');
    }
    async findAllMemberships() {
        return await query(`SELECT m.*, p.name as plan_name, u.full_name, u.email, u.phone
       FROM memberships m
       JOIN membership_plans p ON m.plan_id = p.id
       JOIN users u ON m.user_id = u.user_id
       ORDER BY m.registered_at DESC`);
    }
    async findPlanById(id) {
        const result = await query('SELECT * FROM membership_plans WHERE id = $1', [id]);
        return result[0] || null;
    }
    async findActiveMembershipByUserId(userId) {
        const result = await query(`SELECT m.*, p.name as plan_name
       FROM memberships m
       JOIN membership_plans p ON m.plan_id = p.id
       WHERE m.user_id = $1 AND m.status IN ('active', 'pending')
       ORDER BY m.registered_at DESC
       LIMIT 1`, [userId]);
        return result[0] || null;
    }
    async createMembership(input) {
        const result = await query(`INSERT INTO memberships (user_id, plan_id, student_id, department, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`, [input.user_id, input.plan_id, input.student_id || null, input.department || null]);
        return result[0];
    }
    async updateMembershipStatus(id, status, startDate, endDate) {
        const fields = ['status = $2'];
        const values = [id, status];
        let paramIndex = 3;
        if (startDate) {
            fields.push(`start_date = $${paramIndex++}`);
            values.push(startDate);
        }
        if (endDate) {
            fields.push(`end_date = $${paramIndex++}`);
            values.push(endDate);
        }
        const result = await query(`UPDATE memberships SET ${fields.join(', ')} WHERE id = $1 RETURNING *`, values);
        return result[0];
    }
}
export const membershipRepository = new MembershipRepository();
//# sourceMappingURL=membership.repository.js.map
import { query } from '../config/database.js';
export class UserRepository {
    async findByEmail(email) {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        return result[0] || null;
    }
    async findById(userId) {
        const result = await query('SELECT * FROM users WHERE user_id = $1', [userId]);
        return result[0] || null;
    }
    async create(input) {
        const result = await query(`INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [
            input.email,
            input.password_hash,
            input.full_name,
            input.phone || null,
            input.role || 'member',
        ]);
        return result[0];
    }
    async update(userId, updates) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (updates.full_name !== undefined) {
            fields.push(`full_name = $${paramIndex++}`);
            values.push(updates.full_name);
        }
        if (updates.phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(updates.phone);
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        values.push(userId);
        const result = await query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`, values);
        return result[0];
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map
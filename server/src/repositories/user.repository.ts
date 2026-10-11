import { query } from '../config/database.js';

export interface User {
  user_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  role: string;
  created_at: Date;
}

export interface CreateUserInput {
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role?: string;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result[0] || null;
  }

  async findById(userId: string): Promise<User | null> {
    const result = await query<User>(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );
    return result[0] || null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const result = await query<User>(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.email,
        input.password_hash,
        input.full_name,
        input.phone || null,
        input.role || 'member',
      ]
    );
    return result[0];
  }

  async update(userId: string, updates: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
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

    const result = await query<User>(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
      values
    );
    return result[0];
  }
}

export const userRepository = new UserRepository();

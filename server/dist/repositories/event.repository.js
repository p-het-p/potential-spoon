import { query } from '../config/database.js';
export class EventRepository {
    async findAll(filters) {
        const offset = (filters.page - 1) * filters.limit;
        let whereClause = filters.userRole === 'club_leader'
            ? 'WHERE 1=1'
            : 'WHERE is_public = true AND (ends_at > NOW() OR (ends_at IS NULL AND starts_at > NOW() - INTERVAL \'24 hours\'))';
        const params = [];
        let paramIndex = 1;
        if (filters.search) {
            whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            params.push(`%${filters.search}%`);
            paramIndex++;
        }
        const countQuery = `
      SELECT COUNT(*) as count
      FROM events
      ${whereClause}
    `;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult[0].count, 10);
        const eventsQuery = `
      SELECT *
      FROM events
      ${whereClause}
      ORDER BY starts_at ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
        params.push(filters.limit, offset);
        const events = await query(eventsQuery, params);
        return { events, total };
    }
    async findById(id) {
        const result = await query('SELECT * FROM events WHERE id = $1', [id]);
        return result[0] || null;
    }
    async create(input) {
        const result = await query(`INSERT INTO events (title, description, venue, starts_at, ends_at, capacity, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            input.title,
            input.description || null,
            input.venue || null,
            input.starts_at,
            input.ends_at || null,
            input.capacity,
            input.is_public,
            input.created_by,
        ]);
        return result[0];
    }
    async update(id, updates) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (updates.title !== undefined) {
            fields.push(`title = $${paramIndex++}`);
            values.push(updates.title);
        }
        if (updates.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(updates.description);
        }
        if (updates.venue !== undefined) {
            fields.push(`venue = $${paramIndex++}`);
            values.push(updates.venue);
        }
        if (updates.starts_at !== undefined) {
            fields.push(`starts_at = $${paramIndex++}`);
            values.push(updates.starts_at);
        }
        if (updates.ends_at !== undefined) {
            fields.push(`ends_at = $${paramIndex++}`);
            values.push(updates.ends_at);
        }
        if (updates.capacity !== undefined) {
            fields.push(`capacity = $${paramIndex++}`);
            values.push(updates.capacity);
        }
        if (updates.is_public !== undefined) {
            fields.push(`is_public = $${paramIndex++}`);
            values.push(updates.is_public);
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        values.push(id);
        const result = await query(`UPDATE events SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);
        return result[0];
    }
    async delete(id) {
        await query('DELETE FROM events WHERE id = $1', [id]);
    }
}
export const eventRepository = new EventRepository();
//# sourceMappingURL=event.repository.js.map
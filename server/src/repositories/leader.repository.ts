import { pool } from '../config/database.js';

// --- Fundraisers ---

export async function createFundraiser(data: any) {
  const query = `
    INSERT INTO fundraisers (title, description, goal_amount, current_amount, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [data.title, data.description, data.goal_amount, data.current_amount, data.status];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getFundraisers() {
  const query = `SELECT * FROM fundraisers ORDER BY created_at DESC;`;
  const result = await pool.query(query);
  return result.rows;
}

export async function getFundraiserById(id: string) {
  const query = `SELECT * FROM fundraisers WHERE fundraiser_id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateFundraiser(id: string, data: any) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE fundraisers 
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE fundraiser_id = $${index}
    RETURNING *;
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteFundraiser(id: string) {
  const query = `DELETE FROM fundraisers WHERE fundraiser_id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

// --- Volunteer Tasks ---

export async function createVolunteerTask(data: any) {
  const query = `
    INSERT INTO volunteer_tasks (title, description, assigned_to, fundraiser_id, deadline, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [data.title, data.description, data.assigned_to, data.fundraiser_id, data.deadline, data.status];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getVolunteerTasks() {
  const query = `
    SELECT t.*, u.full_name as assigned_to_name
    FROM volunteer_tasks t
    LEFT JOIN users u ON t.assigned_to = u.user_id
    ORDER BY t.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function updateVolunteerTask(id: string, data: any) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE volunteer_tasks 
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE task_id = $${index}
    RETURNING *;
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteVolunteerTask(id: string) {
  const query = `DELETE FROM volunteer_tasks WHERE task_id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

// --- Announcements ---

export async function createAnnouncement(data: any) {
  const query = `
    INSERT INTO announcements (title, content, audience, author_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [data.title, data.content, data.audience, data.author_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getAnnouncements(role?: string) {
  let query = `
    SELECT a.*, u.full_name as author_name
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.user_id
  `;
  
  if (!role || role === 'guest') {
    query += ` WHERE a.audience = 'all' `;
  } else if (role === 'member') {
    query += ` WHERE a.audience IN ('all', 'members') `;
  }
  // club_leader, treasurer, volunteer see all

  query += ` ORDER BY a.published_at DESC; `;
  const result = await pool.query(query);
  return result.rows;
}

export async function updateAnnouncement(id: string, data: any) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE announcements 
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE announcement_id = $${index}
    RETURNING *;
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteAnnouncement(id: string) {
  const query = `DELETE FROM announcements WHERE announcement_id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

// --- Leader: Members Management ---

export async function getMembers() {
  const query = `
    SELECT 
      m.id as membership_id,
      m.user_id,
      m.student_id,
      m.department,
      m.status,
      m.start_date,
      m.end_date,
      m.registered_at,
      u.full_name,
      u.email,
      u.phone,
      u.role,
      p.name as plan_name,
      p.dues_amount
    FROM memberships m
    JOIN users u ON m.user_id = u.user_id
    LEFT JOIN membership_plans p ON m.plan_id = p.id
    ORDER BY m.registered_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function updateMemberStatus(id: number | string, data: { status?: string; end_date?: string }) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.status) {
    fields.push(`status = $${index++}`);
    values.push(data.status);
  }
  if (data.end_date) {
    fields.push(`end_date = $${index++}`);
    values.push(data.end_date);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE memberships
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getAssignableUsers() {
  const query = `
    SELECT user_id, full_name, email, role
    FROM users
    ORDER BY full_name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

// --- Leader: Merchandise Orders ---

export async function getMerchOrders() {
  const query = `
    SELECT 
      o.order_id,
      o.user_id,
      o.attendee_id,
      o.total_amount,
      o.currency,
      o.status,
      o.created_at,
      u.full_name as customer_name,
      u.email as customer_email,
      COALESCE(
        json_agg(
          json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        ) FILTER (WHERE oi.order_item_id IS NOT NULL), '[]'
      ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY o.order_id, u.full_name, u.email
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

// --- Leader: Overview Statistics ---

export async function getLeaderStats() {
  const [membersRes, eventsRes, tasksRes, fundraisersRes, productsRes] = await Promise.all([
    pool.query(`
      SELECT 
        COUNT(*)::int as total_members,
        COUNT(*) FILTER (WHERE status = 'active')::int as active_members,
        COUNT(*) FILTER (WHERE status = 'expired')::int as expired_members
      FROM memberships;
    `),
    pool.query(`
      SELECT 
        COUNT(*)::int as total_events,
        COALESCE(SUM(capacity), 0)::int as total_capacity
      FROM events;
    `),
    pool.query(`
      SELECT 
        COUNT(*)::int as total_tasks,
        COUNT(*) FILTER (WHERE status = 'pending')::int as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'completed')::int as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'declined')::int as declined_tasks
      FROM volunteer_tasks;
    `),
    pool.query(`
      SELECT 
        COUNT(*)::int as total_fundraisers,
        COALESCE(SUM(goal_amount), 0)::float as total_goal,
        COALESCE(SUM(current_amount), 0)::float as total_raised
      FROM fundraisers;
    `),
    pool.query(`
      SELECT 
        COUNT(*)::int as total_products,
        COALESCE(SUM(stock_quantity), 0)::int as total_stock
      FROM products
      WHERE is_active = true;
    `)
  ]);

  return {
    members: membersRes.rows[0],
    events: eventsRes.rows[0],
    tasks: tasksRes.rows[0],
    fundraisers: fundraisersRes.rows[0],
    merchandise: productsRes.rows[0]
  };
}


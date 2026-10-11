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

export async function getAnnouncements() {
  const query = `
    SELECT a.*, u.full_name as author_name
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.user_id
    ORDER BY a.published_at DESC;
  `;
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

import { Router } from 'express';
import { pool } from '../config/database.js';
import { authenticate } from '../middleware/authenticate.js';
import { volunteerOrHigher } from '../middleware/authorize.js';
import { taskExpenseSchema } from '../schemas/leader.schema.js';
import logger from '../utils/logger.js';
import { z } from 'zod';
const router = Router();
// All volunteer routes require volunteerOrHigher
router.use(authenticate, volunteerOrHigher);
const updateStatusSchema = z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'declined']),
    decline_reason: z.string().optional().nullable(),
});
// GET /api/v1/volunteer/tasks
router.get('/tasks', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const isLeader = ['club_leader', 'treasurer'].includes(req.user?.role);
        const viewAll = isLeader && req.query.all === 'true';
        const query = `
      SELECT 
        t.*, 
        u.full_name as assigned_to_name,
        f.title as fundraiser_title,
        COALESCE(
          json_agg(
            json_build_object(
              'expense_id', e.expense_id,
              'amount', e.amount,
              'description', e.description,
              'receipt_url', e.receipt_url,
              'status', e.status,
              'created_at', e.created_at
            )
          ) FILTER (WHERE e.expense_id IS NOT NULL), '[]'
        ) as expenses
      FROM volunteer_tasks t
      LEFT JOIN users u ON t.assigned_to = u.user_id
      LEFT JOIN fundraisers f ON t.fundraiser_id = f.fundraiser_id
      LEFT JOIN task_expenses e ON t.task_id = e.task_id
      ${viewAll ? '' : 'WHERE t.assigned_to = $1'}
      GROUP BY t.task_id, u.full_name, f.title
      ORDER BY t.created_at DESC;
    `;
        const values = viewAll ? [] : [userId];
        const result = await pool.query(query, values);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        logger.error('Error fetching volunteer tasks:', error);
        return res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});
// PATCH /api/v1/volunteer/tasks/:id/status
router.patch('/tasks/:id/status', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const validated = updateStatusSchema.parse(req.body);
        // Verify task exists and caller is authorized
        const checkQuery = `SELECT * FROM volunteer_tasks WHERE task_id = $1;`;
        const checkResult = await pool.query(checkQuery, [req.params.id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const task = checkResult.rows[0];
        const isLeader = ['club_leader', 'treasurer'].includes(userRole);
        if (!isLeader && task.assigned_to !== userId) {
            return res.status(403).json({ error: 'You are not assigned to this task' });
        }
        const updateQuery = `
      UPDATE volunteer_tasks
      SET status = $1, decline_reason = $2, updated_at = CURRENT_TIMESTAMP
      WHERE task_id = $3
      RETURNING *;
    `;
        const updateResult = await pool.query(updateQuery, [
            validated.status,
            validated.decline_reason || null,
            req.params.id,
        ]);
        return res.status(200).json(updateResult.rows[0]);
    }
    catch (error) {
        logger.error('Error updating task status:', error);
        return res.status(400).json({ error: error.errors || 'Failed to update task status' });
    }
});
// POST /api/v1/volunteer/tasks/:id/expenses
router.post('/tasks/:id/expenses', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const validated = taskExpenseSchema.parse(req.body);
        const taskQuery = `SELECT * FROM volunteer_tasks WHERE task_id = $1;`;
        const taskResult = await pool.query(taskQuery, [req.params.id]);
        if (taskResult.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const task = taskResult.rows[0];
        const isLeader = ['club_leader', 'treasurer'].includes(userRole);
        if (!isLeader && task.assigned_to !== userId) {
            return res.status(403).json({ error: 'You are not assigned to this task' });
        }
        const insertQuery = `
      INSERT INTO task_expenses (task_id, user_id, amount, description, receipt_url, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *;
    `;
        const insertResult = await pool.query(insertQuery, [
            req.params.id,
            userId,
            validated.amount,
            validated.description,
            validated.receipt_url || null,
        ]);
        return res.status(201).json(insertResult.rows[0]);
    }
    catch (error) {
        logger.error('Error submitting task expense:', error);
        return res.status(400).json({ error: error.errors || 'Failed to submit expense' });
    }
});
// GET /api/v1/volunteer/expenses
router.get('/expenses', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const isLeader = ['club_leader', 'treasurer'].includes(req.user?.role);
        const viewAll = isLeader && req.query.all === 'true';
        const query = `
      SELECT 
        e.*,
        t.title as task_title,
        u.full_name as volunteer_name
      FROM task_expenses e
      JOIN volunteer_tasks t ON e.task_id = t.task_id
      JOIN users u ON e.user_id = u.user_id
      ${viewAll ? '' : 'WHERE e.user_id = $1'}
      ORDER BY e.created_at DESC;
    `;
        const values = viewAll ? [] : [userId];
        const result = await pool.query(query, values);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        logger.error('Error fetching volunteer expenses:', error);
        return res.status(500).json({ error: 'Failed to retrieve expenses' });
    }
});
// GET /api/v1/volunteer/summary
router.get('/summary', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const taskCountsQuery = `
      SELECT 
        COUNT(*)::int as total_tasks,
        COUNT(*) FILTER (WHERE status = 'completed')::int as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'pending')::int as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'declined')::int as declined_tasks
      FROM volunteer_tasks
      WHERE assigned_to = $1;
    `;
        const expenseSummaryQuery = `
      SELECT 
        COALESCE(SUM(amount), 0)::float as total_expenses,
        COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0)::float as pending_reimbursements,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::float as paid_reimbursements,
        COUNT(*)::int as claim_count
      FROM task_expenses
      WHERE user_id = $1;
    `;
        const [tasksRes, expensesRes] = await Promise.all([
            pool.query(taskCountsQuery, [userId]),
            pool.query(expenseSummaryQuery, [userId]),
        ]);
        return res.status(200).json({
            tasks: tasksRes.rows[0],
            expenses: expensesRes.rows[0],
        });
    }
    catch (error) {
        logger.error('Error fetching volunteer summary:', error);
        return res.status(500).json({ error: 'Failed to retrieve summary' });
    }
});
export default router;
//# sourceMappingURL=volunteer.routes.js.map
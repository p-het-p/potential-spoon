import { Router } from 'express';
import { financeController } from '../controllers/finance.controller.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = Router();

const financeSummarySchema = z.object({
  query: z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }),
});

const financeTransactionsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('20'),
    purpose: z.enum(['ticket', 'membership_dues', 'merchandise']).optional(),
    status: z.enum(['pending', 'successful', 'failed', 'refunded']).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }),
});

// Get financial summary (treasurer only - auth applied at app.ts level)
router.get(
  '/summary',
  validate(financeSummarySchema),
  (req, res, next) => financeController.getSummary(req, res).catch(next)
);

// List financial transactions (treasurer only)
router.get(
  '/transactions',
  validate(financeTransactionsSchema),
  (req, res, next) => financeController.getTransactions(req, res).catch(next)
);

// Review volunteer expense reimbursements
router.get(
  '/reimbursements',
  (req, res, next) => financeController.getReimbursements(req, res).catch(next)
);

// Approve, Pay, or Reject reimbursement
router.patch(
  '/reimbursements/:id',
  (req, res, next) => financeController.updateReimbursement(req, res).catch(next)
);

// Review activity data (ticket sales, merchandise orders, fundraisers)
router.get(
  '/activity-data',
  (req, res, next) => financeController.getActivityData(req, res).catch(next)
);

export default router;


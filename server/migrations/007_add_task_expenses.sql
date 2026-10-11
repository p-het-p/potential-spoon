-- Up Migration: Add task_expenses and volunteer decline fields

ALTER TABLE volunteer_tasks ADD COLUMN IF NOT EXISTS decline_reason TEXT;

CREATE TABLE IF NOT EXISTS task_expenses (
    expense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES volunteer_tasks(task_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    receipt_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, paid, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

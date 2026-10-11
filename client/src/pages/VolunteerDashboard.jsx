import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Receipt, 
  DollarSign, 
  Calendar, 
  User, 
  LogOut, 
  ChevronRight, 
  Plus, 
  RefreshCw,
  FolderCheck,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { 
  getVolunteerTasks, 
  updateVolunteerTaskStatus, 
  submitTaskExpense, 
  getVolunteerExpenses, 
  getVolunteerSummary, 
  logout as logoutApi 
} from '../lib/api';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export function VolunteerDashboard() {
  const { user, token, logout, clearGuestSession } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'expenses', 'summary'
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ amount: '', description: '', receipt_url: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/volunteer');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, expensesData, summaryData] = await Promise.all([
        getVolunteerTasks(token).catch(() => []),
        getVolunteerExpenses(token).catch(() => []),
        getVolunteerSummary(token).catch(() => null),
      ]);
      setTasks(tasksData || []);
      setExpenses(expensesData || []);
      setSummary(summaryData);
      
      // Update selectedTask if still open
      if (selectedTask) {
        const updated = tasksData.find(t => t.task_id === selectedTask.task_id);
        if (updated) setSelectedTask(updated);
      }
    } catch (err) {
      setError(err.message || 'Failed to load volunteer workflow data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutApi(token);
    } catch {}
    logout();
    clearGuestSession();
    navigate('/');
  };

  // Status transitions matching Club_Volunteer_Workflow.canvas
  const handleMarkInProgress = async (task) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      await updateVolunteerTaskStatus(token, task.task_id, 'in_progress');
      setActionSuccess('Task marked as In Progress. You can now track expenses and complete it.');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineTask = async () => {
    if (!selectedTask) return;
    setActionLoading(true);
    try {
      await updateVolunteerTaskStatus(token, selectedTask.task_id, 'declined', declineReason || 'Declined by volunteer');
      setShowDeclineModal(false);
      setDeclineReason('');
      setSelectedTask(null);
      setActionSuccess('Task declined. Club Leader has been notified so it can be reassigned.');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to decline task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTask = async (task) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      await updateVolunteerTaskStatus(token, task.task_id, 'completed');
      setActionSuccess('Task completed successfully! Great job.');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to complete task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!expenseData.amount || Number(expenseData.amount) <= 0) {
      alert('Please enter a valid expense amount');
      return;
    }
    if (!expenseData.description) {
      alert('Please enter expense details');
      return;
    }

    setActionLoading(true);
    try {
      await submitTaskExpense(token, selectedTask.task_id, {
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        receipt_url: expenseData.receipt_url || null,
      });
      setShowExpenseModal(false);
      setExpenseData({ amount: '', description: '', receipt_url: '' });
      setActionSuccess('Reimbursement claim submitted! Track review & payment in your claims tab.');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to submit expense');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"><Clock size={12} /> In Progress</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"><CheckCircle size={12} /> Completed</span>;
      case 'declined':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800"><XCircle size={12} /> Declined</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const getExpenseStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Paid</span>;
      case 'approved':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">Approved</span>;
      case 'rejected':
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">Rejected</span>;
      default:
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Pending Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-soft)] text-[var(--color-ink)] flex flex-col font-sans">
      <TopNav />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Notification if any */}
        {actionSuccess && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1">Dismiss</button>
          </div>
        )}

        {/* Workflow Header (Canvas Step 1 & 2) */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-hairline)] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Volunteer Portal</span>
              <span className="text-xs text-[var(--color-muted)]">• Club Volunteer Workflow</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Welcome, {user?.full_name || 'Volunteer'}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Review assigned work, report progress, submit reimbursement claims, and finish tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadData} className="flex items-center gap-2 text-xs h-9">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
            {/* Step 7: Sign Out */}
            <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2 text-xs h-9 text-rose-700 hover:bg-rose-50 border border-rose-200">
              <LogOut size={14} /> Sign Out (Step 7)
            </Button>
          </div>
        </div>

        {/* Quick Stats Strip (Canvas Step 2 Dashboard metrics) */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 shadow-xs">
            <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Assigned Tasks</div>
            <div className="mt-2 text-2xl font-black text-[var(--color-ink)]">{tasks.length}</div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">
              {tasks.filter(t => t.status === 'in_progress').length} currently active
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 shadow-xs">
            <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Completed Work</div>
            <div className="mt-2 text-2xl font-black text-emerald-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">Tasks finished</div>
          </div>

          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 shadow-xs">
            <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Total Claims</div>
            <div className="mt-2 text-2xl font-black text-[var(--color-ink)]">
              ${(summary?.expenses?.total_expenses || expenses.reduce((acc, e) => acc + Number(e.amount), 0)).toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">{expenses.length} claims filed</div>
          </div>

          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 shadow-xs">
            <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Pending Claims</div>
            <div className="mt-2 text-2xl font-black text-amber-600">
              ${(summary?.expenses?.pending_reimbursements || expenses.filter(e => e.status === 'pending').reduce((acc, e) => acc + Number(e.amount), 0)).toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">Awaiting reimbursement</div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[var(--color-hairline)] pb-3">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'tasks' 
                ? 'bg-[var(--color-primary)] text-white shadow-xs' 
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
            }`}
          >
            Assigned Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'expenses' 
                ? 'bg-[var(--color-primary)] text-white shadow-xs' 
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
            }`}
          >
            Reimbursement Claims ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'summary' 
                ? 'bg-[var(--color-primary)] text-white shadow-xs' 
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
            }`}
          >
            Workflow Summary
          </button>
        </div>

        {/* TAB 1: ASSIGNED TASKS (Nodes: has-tasks, no-tasks, select-task, accept-task, in-progress, finish-task) */}
        {activeTab === 'tasks' && (
          <div>
            {/* Filter controls */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'pending', 'in_progress', 'completed', 'declined'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                      statusFilter === s 
                        ? 'bg-[var(--color-ink)] text-[var(--color-canvas)]' 
                        : 'bg-[var(--color-canvas)] text-[var(--color-muted)] border border-[var(--color-hairline)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[var(--color-muted)]">Showing {filteredTasks.length} tasks</span>
            </div>

            {/* Empty State (Canvas node: no-tasks) */}
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-hairline)] bg-[var(--color-canvas)] p-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-50 text-amber-600 mb-3">
                  <FolderCheck size={24} />
                </div>
                <h3 className="text-base font-bold text-[var(--color-ink)]">No tasks assigned</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)] max-w-md mx-auto">
                  Wait for an assignment or contact your club coordinator. Check the dashboard again later.
                </p>
                <div className="mt-6">
                  <Button variant="secondary" onClick={loadData} className="text-xs">
                    <RefreshCw size={14} className="mr-1.5" /> Check for Tasks
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.task_id}
                    onClick={() => setSelectedTask(task)}
                    className="group cursor-pointer rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 shadow-xs hover:border-[var(--color-ink)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {getStatusBadge(task.status)}
                        {task.deadline && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-muted)]">
                            <Calendar size={12} />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[var(--color-ink)] group-hover:text-[var(--color-brand-accent)] transition-colors">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">
                        {task.description || 'No additional instructions provided.'}
                      </p>

                      {task.fundraiser_title && (
                        <div className="mt-3 inline-block rounded-md bg-[var(--color-surface-soft)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)]">
                          Fundraiser: {task.fundraiser_title}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs">
                      <span className="text-[var(--color-muted)] flex items-center gap-1">
                        <User size={12} /> {task.assigned_to_name || 'Assigned to you'}
                      </span>
                      <span className="font-semibold text-[var(--color-brand-accent)] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Select task <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REIMBURSEMENT CLAIMS (Canvas Nodes: submit-expense, expense-check) */}
        {activeTab === 'expenses' && (
          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-ink)]">Reimbursement Claims</h2>
                <p className="text-xs text-[var(--color-muted)]">Track review and payment status for expenses incurred during volunteer work.</p>
              </div>
            </div>

            {expenses.length === 0 ? (
              <div className="py-12 text-center text-[var(--color-muted)]">
                <Receipt size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No expenses submitted yet.</p>
                <p className="text-xs mt-1">When working on an active task, you can submit reimbursement claims for personal expenses.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-hairline)]">
                {expenses.map((expense) => (
                  <div key={expense.expense_id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--color-ink)]">${Number(expense.amount).toFixed(2)}</span>
                        {getExpenseStatusBadge(expense.status)}
                      </div>
                      <p className="text-xs text-[var(--color-ink)] font-medium mt-1">{expense.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--color-muted)]">
                        <span>Task: {expense.task_title || 'Volunteer task'}</span>
                        <span>•</span>
                        <span>{new Date(expense.created_at).toLocaleDateString()}</span>
                        {expense.receipt_url && (
                          <>
                            <span>•</span>
                            <a href={expense.receipt_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              View Receipt
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs text-[var(--color-muted)]">
                      Claim ID: #{String(expense.expense_id).slice(0, 8)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WORKFLOW SUMMARY (Canvas Nodes: more-tasks, task-history, sign-out) */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xs">
              <h2 className="text-lg font-bold text-[var(--color-ink)] mb-2">Volunteer Task Summary</h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                Review your completed assignments and outstanding reimbursement claims before finishing your session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-lg bg-[var(--color-surface-soft)] p-4 border border-[var(--color-hairline)]">
                  <div className="text-xs text-[var(--color-muted)] font-semibold uppercase">Completed Tasks</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
                  </div>
                </div>

                <div className="rounded-lg bg-[var(--color-surface-soft)] p-4 border border-[var(--color-hairline)]">
                  <div className="text-xs text-[var(--color-muted)] font-semibold uppercase">Pending Tasks Remaining</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                  </div>
                </div>

                <div className="rounded-lg bg-[var(--color-surface-soft)] p-4 border border-[var(--color-hairline)]">
                  <div className="text-xs text-[var(--color-muted)] font-semibold uppercase">Outstanding Claims</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    ${expenses.filter(e => e.status === 'pending').reduce((acc, e) => acc + Number(e.amount), 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Step 6 / More Tasks decision */}
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-blue-900">More tasks to do?</h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    {tasks.some(t => t.status === 'pending' || t.status === 'in_progress')
                      ? 'You still have assigned tasks available to work on.'
                      : 'All assigned tasks are completed or addressed!'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setActiveTab('tasks')} className="text-xs">
                    Return to Tasks (Canvas Step 2)
                  </Button>
                  <Button variant="primary" onClick={handleSignOut} className="text-xs">
                    Sign Out & Finish Session (Canvas Step 7)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: SELECT A TASK & WORKFLOW ACTIONS (Canvas: select-task, accept-task, in-progress, expense-check, finish-task) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--color-hairline)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedTask.status)}
                  <span className="text-xs text-[var(--color-muted)]">Step 3: Task Details</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--color-ink)]">{selectedTask.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="rounded-full p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
              >
                ✕
              </button>
            </div>

            {/* Task Info Body */}
            <div className="py-4 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Instructions</label>
                <p className="mt-1 text-sm text-[var(--color-ink)] whitespace-pre-line bg-[var(--color-surface-soft)] p-3 rounded-lg border border-[var(--color-hairline)]">
                  {selectedTask.description || 'No detailed instructions provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-[var(--color-surface-soft)] p-3 border border-[var(--color-hairline)]">
                  <span className="text-[var(--color-muted)] block">Responsible Person</span>
                  <span className="font-semibold text-[var(--color-ink)] mt-0.5 block">{selectedTask.assigned_to_name || 'Assigned Volunteer'}</span>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-soft)] p-3 border border-[var(--color-hairline)]">
                  <span className="text-[var(--color-muted)] block">Deadline</span>
                  <span className="font-semibold text-[var(--color-ink)] mt-0.5 block">
                    {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleString() : 'No deadline set'}
                  </span>
                </div>
              </div>

              {selectedTask.decline_reason && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                  <span className="font-bold">Decline Reason:</span> {selectedTask.decline_reason}
                </div>
              )}

              {/* Associated Expenses list for this task */}
              {selectedTask.expenses && selectedTask.expenses.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Claims Filed for this Task</label>
                  <div className="mt-2 space-y-1.5">
                    {selectedTask.expenses.map((exp, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-[var(--color-surface-soft)] p-2 rounded border border-[var(--color-hairline)]">
                        <div>
                          <span className="font-bold">${Number(exp.amount).toFixed(2)}</span> - {exp.description}
                        </div>
                        {getExpenseStatusBadge(exp.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Action Block based on Canvas Workflow */}
              <div className="mt-6 pt-4 border-t border-[var(--color-hairline)] space-y-3">
                {/* 1. If Status is PENDING -> "Can the volunteer take the task?" */}
                {selectedTask.status === 'pending' && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                      Can you take this task?
                    </h4>
                    <p className="text-xs text-amber-800 mb-3">
                      Confirm whether you can complete this task, or notify the Club Leader to reassign it.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => handleMarkInProgress(selectedTask)}
                        disabled={actionLoading}
                        className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-700"
                      >
                        ✓ Yes — Mark In Progress (Step 4)
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => setShowDeclineModal(true)}
                        disabled={actionLoading}
                        className="text-xs h-9 text-rose-700 hover:bg-rose-50 border border-rose-200"
                      >
                        ✕ No — Decline & Notify Leader
                      </Button>
                    </div>
                  </div>
                )}

                {/* 2. If Status is IN_PROGRESS -> Expense Check & Complete Task */}
                {selectedTask.status === 'in_progress' && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                        Work in Progress
                      </h4>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Did you incur any personal expense for this task?
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {/* Step 5A: Submit Expense */}
                      <Button 
                        variant="secondary"
                        onClick={() => setShowExpenseModal(true)}
                        className="flex-1 text-xs h-9 flex items-center justify-center gap-1.5"
                      >
                        <DollarSign size={14} /> 5A. Submit Expense Claim
                      </Button>
                      
                      {/* Step 6: Complete Task */}
                      <Button 
                        variant="primary" 
                        onClick={() => handleCompleteTask(selectedTask)}
                        disabled={actionLoading}
                        className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={14} /> 6. Complete Task
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. If Status is COMPLETED */}
                {selectedTask.status === 'completed' && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <CheckCircle className="size-8 text-emerald-600 mx-auto mb-1" />
                    <h4 className="text-sm font-bold text-emerald-900">Task Completed</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      This task is marked as finished. Your coordinator will review the completion.
                    </p>
                  </div>
                )}

                {/* 4. If Status is DECLINED */}
                {selectedTask.status === 'declined' && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-center">
                    <XCircle className="size-8 text-rose-600 mx-auto mb-1" />
                    <h4 className="text-sm font-bold text-rose-900">Task Declined</h4>
                    <p className="text-xs text-rose-700 mt-1">
                      Club leader was notified for reassignment.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button variant="ghost" onClick={() => setSelectedTask(null)} className="text-xs">
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DECLINE TASK NOTE (Canvas node: decline-task "No — Notify Club Leader") */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] shadow-2xl p-6">
            <h3 className="text-base font-bold text-[var(--color-ink)]">Decline Task & Notify Leader</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Let the Club Leader know why you cannot take this task so it can be reassigned promptly.
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-[var(--color-ink)]">Reason / Note (optional)</label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Scheduling conflict, unavailable this weekend, etc."
                rows={3}
                className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-2.5 text-xs text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowDeclineModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleDeclineTask} 
                disabled={actionLoading}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Decline & Notify
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT EXPENSE CLAIM (Canvas node: submit-expense "5A. Submit Expense") */}
      {showExpenseModal && selectedTask && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 uppercase">Step 5A</span>
                <h3 className="text-base font-bold text-[var(--color-ink)]">Submit Reimbursement Claim</h3>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]">✕</button>
            </div>

            <form onSubmit={handleSubmitExpense} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--color-ink)]">Expense Amount ($)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[var(--color-muted)]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                    placeholder="25.50"
                    className="w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] py-2 pl-7 pr-3 text-xs text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-ink)]">Expense Details / Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                  placeholder="e.g., Supplies for poster making, printing flyers, parking fee"
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-2.5 text-xs text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-ink)]">Attach Receipt Link / Image URL (optional)</label>
                <input
                  type="url"
                  value={expenseData.receipt_url}
                  onChange={(e) => setExpenseData({ ...expenseData, receipt_url: e.target.value })}
                  placeholder="https://example.com/receipt.jpg"
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-2 text-xs text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="mt-1 text-[11px] text-[var(--color-muted)]">Paste link to digital receipt or upload receipt image to cloud.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowExpenseModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={actionLoading} className="text-xs bg-emerald-600 hover:bg-emerald-700">
                  {actionLoading ? 'Submitting...' : 'Submit Claim'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

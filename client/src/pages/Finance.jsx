import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { 
  getFinanceSummary, 
  getFinanceTransactions, 
  getReimbursements, 
  updateReimbursement,
  getFinanceActivityData 
} from '../lib/api';
import { useAuth } from '../lib/auth';

export function Finance() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'reimbursements' | 'activity'
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ purpose: '', status: '' });
  const [actionMessage, setActionMessage] = useState('');

  const loadData = () => {
    if (!token) return;
    const params = { page, limit: 20 };
    if (filters.purpose) params.purpose = filters.purpose;
    if (filters.status) params.status = filters.status;

    Promise.all([
      getFinanceSummary(token),
      getFinanceTransactions(token, params),
      getReimbursements(token).catch(() => []),
      getFinanceActivityData(token).catch(() => null)
    ]).then(([s, t, r, a]) => {
      setSummary(s);
      setTransactions(t.transactions || []);
      setTotal(t.pagination?.total || 0);
      setReimbursements(r || []);
      setActivityData(a);
    }).catch(() => {})
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [token, page, filters]);

  const handleReimbursementAction = async (id, status, isReject = false) => {
    let note = '';
    if (isReject) {
      note = window.prompt('Please enter reason for rejecting this claim:');
      if (!note) return;
    }
    try {
      await updateReimbursement(token, id, { status, note });
      setActionMessage(status === 'paid' ? 'Claim approved and marked paid.' : 'Claim rejected.');
      loadData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const pendingReimbursementsCount = reimbursements.filter(r => r.status === 'pending').length;

  const summaryCards = summary ? [
    { label: 'Total Revenue', value: `₹${parseFloat(summary.total_revenue || 0).toLocaleString()}`, color: 'var(--color-success)' },
    { label: 'Net Balance', value: `₹${parseFloat(summary.net_balance || 0).toLocaleString()}`, color: 'var(--color-brand-accent)' },
    { label: 'Claims Waiting Review', value: pendingReimbursementsCount, color: pendingReimbursementsCount > 0 ? 'var(--color-warning)' : 'var(--color-muted)' },
    { label: 'Refunded / Outflow', value: `₹${parseFloat(summary.refunded || 0).toLocaleString()}`, color: 'var(--color-error)' },
  ] : [];

  const statusColor = (s) => ({
    successful: 'text-[var(--color-success)]',
    paid: 'text-[var(--color-success)]',
    approved: 'text-sky-600',
    pending: 'text-[var(--color-warning)]',
    failed: 'text-[var(--color-error)]',
    rejected: 'text-[var(--color-error)]',
    refunded: 'text-[var(--color-badge-violet)]',
  }[s] || 'text-[var(--color-muted)]');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />
      <main className="flex-1 py-[48px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-accent)]">
                Treasurer & Leadership Ledger
              </p>
              <h1 className="text-[36px] font-semibold tracking-[-1px] text-[var(--color-ink)]">
                Club Finance Dashboard
              </h1>
            </div>
            <div className="text-sm text-[var(--color-muted)]">
              Authorized role: <strong>{user?.role === 'treasurer' ? 'Treasurer' : 'Club Leader'}</strong>
            </div>
          </div>

          {actionMessage && (
            <div className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-3 text-sm text-[var(--color-ink)]">
              {actionMessage}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[var(--color-canvas)] rounded-[var(--radius-lg)] p-6 animate-pulse h-[100px]" />
              ))}
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {summaryCards.map((c, i) => (
                  <div key={i} className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                    <div className="text-[13px] text-[var(--color-muted)] mb-1">{c.label}</div>
                    <div className="text-[24px] font-semibold" style={{ color: c.color }}>{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Navigation Tabs (Treasurer Workflow Areas) */}
              <div className="flex gap-2 border-b border-[var(--color-hairline)] mb-6">
                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'ledger'
                      ? 'border-[var(--color-brand-accent)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  Financial Transactions & Ledger
                </button>
                <button
                  onClick={() => setActiveTab('reimbursements')}
                  className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'reimbursements'
                      ? 'border-[var(--color-brand-accent)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  <span>Review Reimbursements</span>
                  {pendingReimbursementsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {pendingReimbursementsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-[var(--color-brand-accent)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  Leader Activity Data Coordination
                </button>
              </div>

              {/* Tab 1: Ledger & Transactions */}
              {activeTab === 'ledger' && (
                <div>
                  {/* Filters */}
                  <div className="flex gap-3 mb-6 flex-wrap">
                    <select
                      className="h-10 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-3 text-[14px] text-[var(--color-ink)]"
                      value={filters.purpose}
                      onChange={e => { setFilters(f => ({ ...f, purpose: e.target.value })); setPage(1); }}
                    >
                      <option value="">All purposes</option>
                      <option value="ticket">Ticket</option>
                      <option value="membership_dues">Membership</option>
                      <option value="merchandise">Merchandise</option>
                    </select>
                    <select
                      className="h-10 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-3 text-[14px] text-[var(--color-ink)]"
                      value={filters.status}
                      onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
                    >
                      <option value="">All statuses</option>
                      <option value="successful">Successful</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Transactions table */}
                  <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
                    <table className="w-full text-[14px]">
                      <thead>
                        <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                          <th className="text-left p-4 font-semibold text-[var(--color-ink)]">Payment ID</th>
                          <th className="text-left p-4 font-semibold text-[var(--color-ink)]">Purpose</th>
                          <th className="text-left p-4 font-semibold text-[var(--color-ink)]">Amount</th>
                          <th className="text-left p-4 font-semibold text-[var(--color-ink)]">Status</th>
                          <th className="text-left p-4 font-semibold text-[var(--color-ink)]">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr><td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No transactions found</td></tr>
                        ) : transactions.map(t => (
                          <tr key={t.id} className="border-b border-[var(--color-hairline-soft)]">
                            <td className="p-4 text-[var(--color-muted)]">#{t.id}</td>
                            <td className="p-4 capitalize">{t.purpose?.replace('_', ' ')}</td>
                            <td className="p-4 font-semibold text-[var(--color-ink)]">₹{t.amount.toFixed(2)}</td>
                            <td className={`p-4 font-medium capitalize ${statusColor(t.status)}`}>{t.status}</td>
                            <td className="p-4 text-[var(--color-muted)]">{new Date(t.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {total > 20 && (
                    <div className="flex justify-center gap-3 mt-6">
                      <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                      <span className="flex items-center text-[14px] text-[var(--color-muted)] px-4">Page {page}</span>
                      <Button variant="secondary" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next</Button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Review Reimbursements (Treasurer Workflow B & Claim Valid?) */}
              {activeTab === 'reimbursements' && (
                <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden">
                  <div className="p-5 border-b border-[var(--color-hairline)] flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-[var(--color-ink)] text-base">Volunteer Reimbursement Claims</h2>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        Verify expense legitimacy, receipt attachments, and approve payouts or reject claims.
                      </p>
                    </div>
                  </div>
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase tracking-wider">
                        <th className="text-left p-4">Volunteer</th>
                        <th className="text-left p-4">Task</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Description</th>
                        <th className="text-left p-4">Receipt</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                      {reimbursements.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-[var(--color-muted)]">No reimbursement claims submitted yet.</td></tr>
                      ) : reimbursements.map(claim => (
                        <tr key={claim.expense_id} className="hover:bg-zinc-50/50">
                          <td className="p-4">
                            <div className="font-semibold text-[var(--color-ink)]">{claim.volunteer_name}</div>
                            <div className="text-xs text-[var(--color-muted)]">{claim.volunteer_email}</div>
                          </td>
                          <td className="p-4 text-[var(--color-ink)] font-medium">
                            {claim.task_title}
                          </td>
                          <td className="p-4 font-bold text-[var(--color-ink)]">
                            ₹{parseFloat(claim.amount).toFixed(2)}
                          </td>
                          <td className="p-4 text-xs text-[var(--color-muted)] max-w-xs">
                            {claim.description}
                          </td>
                          <td className="p-4 text-xs">
                            {claim.receipt_url ? (
                              <a 
                                href={claim.receipt_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[var(--color-brand-accent)] underline font-medium"
                              >
                                View Receipt ↗
                              </a>
                            ) : (
                              <span className="text-[var(--color-muted)]">No receipt</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${statusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {claim.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="primary" 
                                  className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => handleReimbursementAction(claim.expense_id, 'paid')}
                                >
                                  Approve & Pay
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  className="h-8 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleReimbursementAction(claim.expense_id, 'rejected', true)}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-[var(--color-muted)] italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Activity Data Coordination (Treasurer Workflow E & Summary) */}
              {activeTab === 'activity' && (
                <div className="space-y-8">
                  {/* Event Ticket Sales */}
                  <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                    <h2 className="font-semibold text-[var(--color-ink)] text-lg mb-2">Event Ticket Sales & Attendance</h2>
                    <p className="text-xs text-[var(--color-muted)] mb-4">Real-time attendance and entrance verification tracking.</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-muted)]">
                          <th className="pb-3">Event</th>
                          <th className="pb-3">Capacity</th>
                          <th className="pb-3">Tickets Sold</th>
                          <th className="pb-3">Checked In</th>
                          <th className="pb-3 text-right">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                        {activityData?.events?.map(ev => (
                          <tr key={ev.id}>
                            <td className="py-3 font-medium text-[var(--color-ink)]">{ev.title}</td>
                            <td className="py-3 text-[var(--color-muted)]">{ev.capacity || 'Unlimited'}</td>
                            <td className="py-3 font-semibold">{ev.tickets_sold}</td>
                            <td className="py-3 text-emerald-600 font-semibold">{ev.checked_in_count}</td>
                            <td className="py-3 text-right font-bold text-[var(--color-ink)]">₹{ev.revenue.toFixed(2)}</td>
                          </tr>
                        )) || <tr><td colSpan={5} className="py-4 text-center text-[var(--color-muted)]">No event data</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  {/* Merchandise Sales */}
                  <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                    <h2 className="font-semibold text-[var(--color-ink)] text-lg mb-2">Merchandise Inventory & Sales</h2>
                    <p className="text-xs text-[var(--color-muted)] mb-4">Stock tracking and units sold through central orders.</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-muted)]">
                          <th className="pb-3">Product</th>
                          <th className="pb-3">Current Stock</th>
                          <th className="pb-3">Units Sold</th>
                          <th className="pb-3 text-right">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                        {activityData?.merchandise?.map(m => (
                          <tr key={m.product_id}>
                            <td className="py-3 font-medium text-[var(--color-ink)]">{m.name}</td>
                            <td className="py-3 text-[var(--color-muted)]">{m.stock_quantity ?? 'N/A'}</td>
                            <td className="py-3 font-semibold">{m.units_sold}</td>
                            <td className="py-3 text-right font-bold text-[var(--color-ink)]">₹{m.total_revenue.toFixed(2)}</td>
                          </tr>
                        )) || <tr><td colSpan={4} className="py-4 text-center text-[var(--color-muted)]">No merchandise data</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  {/* Fundraisers Progress */}
                  <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                    <h2 className="font-semibold text-[var(--color-ink)] text-lg mb-2">Fundraiser Progress</h2>
                    <p className="text-xs text-[var(--color-muted)] mb-4">Fundraising goals and current collections.</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-muted)]">
                          <th className="pb-3">Fundraiser</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Goal</th>
                          <th className="pb-3">Raised So Far</th>
                          <th className="pb-3 text-right">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                        {activityData?.fundraisers?.map(f => {
                          const goal = parseFloat(f.goal_amount || 0);
                          const current = parseFloat(f.current_amount || 0);
                          const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
                          return (
                            <tr key={f.fundraiser_id}>
                              <td className="py-3 font-medium text-[var(--color-ink)]">{f.title}</td>
                              <td className="py-3 capitalize text-xs font-semibold">{f.status}</td>
                              <td className="py-3">₹{goal.toFixed(2)}</td>
                              <td className="py-3 font-bold text-emerald-700">₹{current.toFixed(2)}</td>
                              <td className="py-3 text-right font-semibold">{pct}%</td>
                            </tr>
                          );
                        }) || <tr><td colSpan={5} className="py-4 text-center text-[var(--color-muted)]">No fundraiser data</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

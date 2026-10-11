import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getFinanceSummary, getFinanceTransactions } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Finance() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ purpose: '', status: '' });

  useEffect(() => {
    if (!token) return;
    const params = { page, limit: 20 };
    if (filters.purpose) params.purpose = filters.purpose;
    if (filters.status) params.status = filters.status;

    Promise.all([
      getFinanceSummary(token),
      getFinanceTransactions(token, params)
    ]).then(([s, t]) => {
      setSummary(s);
      setTransactions(t.transactions || []);
      setTotal(t.pagination?.total || 0);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, [token, page, filters]);

  const summaryCards = summary ? [
    { label: 'Total Revenue', value: `₹${parseFloat(summary.total_revenue || 0).toLocaleString()}`, color: 'var(--color-success)' },
    { label: 'Net Balance', value: `₹${parseFloat(summary.net_balance || 0).toLocaleString()}`, color: 'var(--color-brand-accent)' },
    { label: 'Successful', value: summary.successful_count || 0, color: 'var(--color-success)' },
    { label: 'Pending', value: summary.pending_count || 0, color: 'var(--color-warning)' },
  ] : [];

  const statusColor = (s) => ({
    successful: 'text-[var(--color-success)]',
    pending: 'text-[var(--color-warning)]',
    failed: 'text-[var(--color-error)]',
    refunded: 'text-[var(--color-badge-violet)]',
  }[s] || 'text-[var(--color-muted)]');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />
      <main className="flex-1 py-[48px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[36px] font-semibold tracking-[-1px] text-[var(--color-ink)] mb-8">Finance Dashboard</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-[var(--color-canvas)] rounded-[var(--radius-lg)] p-6 animate-pulse h-[100px]" />)}
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
                      <th className="text-left p-4 font-semibold text-[var(--color-ink)]">ID</th>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

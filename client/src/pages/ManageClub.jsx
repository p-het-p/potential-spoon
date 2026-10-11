import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  getLeaderMembers, 
  updateLeaderMemberStatus,
  getAssignableUsers,
  getLeaderTasks,
  createLeaderTask,
  deleteLeaderTask,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getFundraisers,
  createFundraiser,
  deleteFundraiser,
  getProducts,
  createProduct,
  deleteProduct,
  getLeaderMerchOrders,
  getLeaderStats
} from '../lib/api';
import { useAuth } from '../lib/auth';

export function ManageClub() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'members' | 'tasks' | 'announcements' | 'merchandise' | 'fundraisers'
  
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [fundraisers, setFundraisers] = useState([]);
  const [products, setProducts] = useState([]);
  const [merchOrders, setMerchOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '', fundraiser_id: '', deadline: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', audience: 'all' });
  const [fundraiserForm, setFundraiserForm] = useState({ title: '', description: '', goal_amount: 0 });
  const [productForm, setProductForm] = useState({ name: '', description: '', member_price: '', non_member_price: '', stock_quantity: 50, product_type: 'merchandise' });

  const loadAll = () => {
    if (!token) return;
    Promise.all([
      getLeaderStats(token).catch(() => null),
      getLeaderMembers(token).catch(() => []),
      getLeaderTasks(token).catch(() => []),
      getAssignableUsers(token).catch(() => []),
      getAnnouncements(token).catch(() => []),
      getFundraisers(token).catch(() => []),
      getProducts({ type: 'merchandise' }).then(res => res.products || []).catch(() => []),
      getLeaderMerchOrders(token).catch(() => [])
    ]).then(([st, m, t, v, a, f, p, mo]) => {
      setStats(st);
      setMembers(m || []);
      setTasks(t || []);
      setVolunteers(v || []);
      setAnnouncements(a || []);
      setFundraisers(f || []);
      setProducts(p || []);
      setMerchOrders(mo || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  if (!token || user?.role !== 'club_leader') {
    return <Navigate to="/dashboard" replace />;
  }

  // Member Status Update
  const handleMemberStatus = async (membershipId, status) => {
    try {
      await updateLeaderMemberStatus(token, membershipId, { status });
      setMessage(`Membership status updated to ${status}.`);
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // Task submit
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        assigned_to: taskForm.assigned_to || null,
        fundraiser_id: taskForm.fundraiser_id || null,
        deadline: taskForm.deadline ? new Date(taskForm.deadline).toISOString() : null,
        status: 'pending'
      };
      await createLeaderTask(token, payload);
      setTaskForm({ title: '', description: '', assigned_to: '', fundraiser_id: '', deadline: '' });
      setMessage('Volunteer task assigned successfully.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteLeaderTask(token, id);
      setMessage('Task deleted.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  // Announcement submit
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement(token, announcementForm);
      setAnnouncementForm({ title: '', content: '', audience: 'all' });
      setMessage('Announcement published.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(token, id);
      setMessage('Announcement deleted.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  // Fundraiser submit
  const handleCreateFundraiser = async (e) => {
    e.preventDefault();
    try {
      await createFundraiser(token, {
        title: fundraiserForm.title,
        description: fundraiserForm.description,
        goal_amount: Number(fundraiserForm.goal_amount),
        current_amount: 0,
        status: 'planning'
      });
      setFundraiserForm({ title: '', description: '', goal_amount: 0 });
      setMessage('Fundraiser created.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  const handleDeleteFundraiser = async (id) => {
    if (!window.confirm('Delete this fundraiser?')) return;
    try {
      await deleteFundraiser(token, id);
      setMessage('Fundraiser deleted.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  // Merchandise submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct(token, {
        name: productForm.name,
        description: productForm.description,
        member_price: Number(productForm.member_price),
        non_member_price: Number(productForm.non_member_price || productForm.member_price),
        stock_quantity: Number(productForm.stock_quantity),
        product_type: 'merchandise'
      });
      setProductForm({ name: '', description: '', member_price: '', non_member_price: '', stock_quantity: 50, product_type: 'merchandise' });
      setMessage('Merchandise product added.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this merchandise product?')) return;
    try {
      await deleteProduct(token, id);
      setMessage('Product deleted.');
      loadAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(`Error: ${err.message}`); }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-soft)] text-[var(--color-body)] flex flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 flex-1">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-accent)]">
              Club Leader Operations Hub
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              Club Management
            </h1>
          </div>
          <div className="flex gap-2">
            <Link to="/manage/events"><Button variant="secondary" className="text-xs">Manage Events</Button></Link>
            <Link to="/finance"><Button variant="secondary" className="text-xs">Finance Coordination</Button></Link>
          </div>
        </div>

        {message && (
          <div role="status" className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-3 text-sm text-[var(--color-ink)] font-medium">
            {message}
          </div>
        )}

        {/* Tab Navigation (Club Leader Workflow Canvas Areas A-F) */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--color-hairline)] mb-8 pb-px">
          {[
            { id: 'overview', label: 'Club Status Overview' },
            { id: 'members', label: 'A. Manage Members' },
            { id: 'tasks', label: 'C. Volunteer Tasks' },
            { id: 'announcements', label: 'D. Announcements' },
            { id: 'merchandise', label: 'E. Merchandise' },
            { id: 'fundraisers', label: 'F. Fundraisers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--color-brand-accent)] text-[var(--color-ink)]'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: OVERVIEW & STATUS REVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-5">
                <span className="text-xs text-[var(--color-muted)] font-semibold uppercase">Total Members</span>
                <p className="text-2xl font-bold text-[var(--color-ink)] mt-1">{stats?.members?.total_members ?? 0}</p>
                <p className="text-xs text-emerald-600 mt-1">{stats?.members?.active_members ?? 0} active</p>
              </div>
              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-5">
                <span className="text-xs text-[var(--color-muted)] font-semibold uppercase">Published Events</span>
                <p className="text-2xl font-bold text-[var(--color-ink)] mt-1">{stats?.events?.total_events ?? 0}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">{stats?.events?.total_capacity ?? 0} capacity</p>
              </div>
              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-5">
                <span className="text-xs text-[var(--color-muted)] font-semibold uppercase">Volunteer Tasks</span>
                <p className="text-2xl font-bold text-[var(--color-ink)] mt-1">{stats?.tasks?.total_tasks ?? 0}</p>
                <p className="text-xs text-amber-600 mt-1">{stats?.tasks?.pending_tasks ?? 0} pending review</p>
              </div>
              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-5">
                <span className="text-xs text-[var(--color-muted)] font-semibold uppercase">Fundraiser Total</span>
                <p className="text-2xl font-bold text-[var(--color-ink)] mt-1">₹{stats?.fundraisers?.total_raised ?? 0}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Goal: ₹{stats?.fundraisers?.total_goal ?? 0}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                <h3 className="font-semibold text-[var(--color-ink)] text-base mb-3">Quick Navigation</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button onClick={() => setActiveTab('members')} className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    👥 Review Members →
                  </button>
                  <Link to="/manage/events" className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    📅 Manage Events →
                  </Link>
                  <button onClick={() => setActiveTab('tasks')} className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    📋 Assign Tasks →
                  </button>
                  <button onClick={() => setActiveTab('announcements')} className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    📢 Post Notice →
                  </button>
                  <button onClick={() => setActiveTab('merchandise')} className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    👕 Merchandise →
                  </button>
                  <button onClick={() => setActiveTab('fundraisers')} className="p-3 text-left rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 font-medium text-[var(--color-ink)]">
                    🎯 Fundraisers →
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
                <h3 className="font-semibold text-[var(--color-ink)] text-base mb-2">Treasurer Coordination</h3>
                <p className="text-xs text-[var(--color-muted)] mb-4">
                  Share event activity, check merchandise order payments, review expense claims, and reconcile financial transactions with the treasurer.
                </p>
                <div className="pt-2">
                  <Link to="/finance">
                    <Button variant="primary" className="text-xs">Open Treasurer Finance Ledger</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MANAGE MEMBERS (Area A) ─── */}
        {activeTab === 'members' && (
          <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[var(--color-hairline)] flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-[var(--color-ink)] text-base">Club Membership Registrations</h2>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  Review dues and payment status, check expiry dates, and update member access.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--color-muted)]">{members.length} members</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase">
                  <th className="text-left p-4">Member Name & Email</th>
                  <th className="text-left p-4">Student ID / Dept</th>
                  <th className="text-left p-4">Plan & Dues</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Expires</th>
                  <th className="text-right p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                {members.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-[var(--color-muted)]">No registered members found.</td></tr>
                ) : members.map((m) => (
                  <tr key={m.membership_id} className="hover:bg-zinc-50/50">
                    <td className="p-4">
                      <div className="font-semibold text-[var(--color-ink)]">{m.full_name}</div>
                      <div className="text-xs text-[var(--color-muted)]">{m.email}</div>
                    </td>
                    <td className="p-4 text-xs text-[var(--color-ink)]">
                      <div>{m.student_id || 'N/A'}</div>
                      <div className="text-[var(--color-muted)]">{m.department || ''}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-[var(--color-ink)]">{m.plan_name || 'Standard'}</div>
                      <div className="text-[var(--color-muted)]">₹{m.dues_amount || 0}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[var(--color-muted)]">
                      {m.end_date ? new Date(m.end_date).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="p-4 text-right">
                      {m.status === 'active' ? (
                        <button
                          onClick={() => handleMemberStatus(m.membership_id, 'expired')}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Mark Expired
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMemberStatus(m.membership_id, 'active')}
                          className="text-xs text-emerald-700 hover:underline font-semibold"
                        >
                          Activate / Renew
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 3: MANAGE VOLUNTEERS & TASKS (Area C) ─── */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6 shadow-sm">
              <h2 className="font-semibold text-[var(--color-ink)] text-base mb-4">Create New Volunteer Task</h2>
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Task Title *</span>
                  <Input 
                    required 
                    value={taskForm.title} 
                    onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} 
                    placeholder="e.g. Set up ticket counter stall" 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Assign To Volunteer</span>
                  <select 
                    className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3 bg-white"
                    value={taskForm.assigned_to}
                    onChange={e => setTaskForm(f => ({ ...f, assigned_to: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {volunteers.map(v => (
                      <option key={v.user_id} value={v.user_id}>{v.full_name} ({v.role})</option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Task Instructions & Description</span>
                  <textarea 
                    className="w-full min-h-20 rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-3 text-sm"
                    value={taskForm.description}
                    onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Provide detailed instructions for the volunteer..."
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Link to Fundraiser (Optional)</span>
                  <select 
                    className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3 bg-white"
                    value={taskForm.fundraiser_id}
                    onChange={e => setTaskForm(f => ({ ...f, fundraiser_id: e.target.value }))}
                  >
                    <option value="">None</option>
                    {fundraisers.map(f => (
                      <option key={f.fundraiser_id} value={f.fundraiser_id}>{f.title}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Deadline</span>
                  <Input 
                    type="datetime-local" 
                    value={taskForm.deadline} 
                    onChange={e => setTaskForm(f => ({ ...f, deadline: e.target.value }))} 
                  />
                </label>
                <div className="md:col-span-2 pt-2">
                  <Button type="submit">Assign Volunteer Task</Button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <h3 className="font-semibold text-[var(--color-ink)]">All Volunteer Tasks</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase">
                    <th className="text-left p-4">Task</th>
                    <th className="text-left p-4">Assigned To</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Deadline</th>
                    <th className="text-right p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                  {tasks.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No volunteer tasks created yet.</td></tr>
                  ) : tasks.map(t => (
                    <tr key={t.task_id} className="hover:bg-zinc-50/50">
                      <td className="p-4">
                        <div className="font-semibold text-[var(--color-ink)]">{t.title}</div>
                        <div className="text-xs text-[var(--color-muted)] line-clamp-1">{t.description}</div>
                        {t.status === 'declined' && t.decline_reason && (
                          <div className="text-xs text-red-600 mt-1 font-semibold">
                            Declined reason: "{t.decline_reason}"
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs font-medium text-[var(--color-ink)]">
                        {t.assigned_to_name || 'Unassigned'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'in_progress' ? 'bg-sky-100 text-sky-800' :
                          t.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[var(--color-muted)]">
                        {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteTask(t.task_id)}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 4: PUBLISH ANNOUNCEMENTS (Area D) ─── */}
        {activeTab === 'announcements' && (
          <div className="space-y-8">
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6 shadow-sm">
              <h2 className="font-semibold text-[var(--color-ink)] text-base mb-4">Publish New Announcement</h2>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-sm">
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Announcement Title *</span>
                  <Input 
                    required 
                    value={announcementForm.title} 
                    onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))} 
                    placeholder="e.g. Club Elections or Spring Workshop Schedule" 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Intended Audience</span>
                  <select 
                    className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3 bg-white"
                    value={announcementForm.audience}
                    onChange={e => setAnnouncementForm(f => ({ ...f, audience: e.target.value }))}
                  >
                    <option value="all">Public (All Visitors & Non-Members)</option>
                    <option value="members">Members Only</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Content *</span>
                  <textarea 
                    required
                    className="w-full min-h-24 rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-3 text-sm"
                    value={announcementForm.content}
                    onChange={e => setAnnouncementForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Write the announcement details..."
                  />
                </label>
                <Button type="submit">Publish Announcement</Button>
              </form>
            </div>

            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <h3 className="font-semibold text-[var(--color-ink)]">Announcement History</h3>
              </div>
              <div className="divide-y divide-[var(--color-hairline-soft)]">
                {announcements.length === 0 ? (
                  <p className="p-8 text-center text-sm text-[var(--color-muted)]">No announcements published yet.</p>
                ) : announcements.map(a => (
                  <div key={a.announcement_id} className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                          {a.audience === 'all' ? 'Public' : 'Members Only'}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          {new Date(a.published_at || a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[var(--color-ink)] text-base">{a.title}</h4>
                      <p className="text-xs text-[var(--color-muted)] mt-1 whitespace-pre-line leading-relaxed">{a.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAnnouncement(a.announcement_id)}
                      className="text-xs text-red-600 hover:underline font-semibold shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: MANAGE MERCHANDISE (Area E) ─── */}
        {activeTab === 'merchandise' && (
          <div className="space-y-8">
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6 shadow-sm">
              <h2 className="font-semibold text-[var(--color-ink)] text-base mb-4">Add Merchandise Listing (Hoodies, T-Shirts)</h2>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <label className="block md:col-span-2">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Product Name *</span>
                  <Input 
                    required 
                    value={productForm.name} 
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} 
                    placeholder="e.g. Official Club Hoodie 2026 (Navy Blue)" 
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Description & Sizes</span>
                  <textarea 
                    className="w-full min-h-16 rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-3 text-sm"
                    value={productForm.description} 
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} 
                    placeholder="Available in S, M, L, XL. 100% Cotton fleece." 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Member Price (₹) *</span>
                  <Input 
                    type="number" 
                    required 
                    value={productForm.member_price} 
                    onChange={e => setProductForm(f => ({ ...f, member_price: e.target.value }))} 
                    placeholder="699" 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Regular / Non-Member Price (₹)</span>
                  <Input 
                    type="number" 
                    value={productForm.non_member_price} 
                    onChange={e => setProductForm(f => ({ ...f, non_member_price: e.target.value }))} 
                    placeholder="999" 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Available Inventory Stock</span>
                  <Input 
                    type="number" 
                    value={productForm.stock_quantity} 
                    onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))} 
                    placeholder="50" 
                  />
                </label>
                <div className="md:col-span-2 pt-2">
                  <Button type="submit">Create Merchandise Item</Button>
                </div>
              </form>
            </div>

            {/* Merchandise Products Table */}
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <h3 className="font-semibold text-[var(--color-ink)]">Current Merchandise Listings</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase">
                    <th className="text-left p-4">Item Name</th>
                    <th className="text-left p-4">Member Price</th>
                    <th className="text-left p-4">Regular Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-right p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No merchandise listings created yet.</td></tr>
                  ) : products.map(p => (
                    <tr key={p.product_id} className="hover:bg-zinc-50/50">
                      <td className="p-4">
                        <div className="font-semibold text-[var(--color-ink)]">{p.name}</div>
                        <div className="text-xs text-[var(--color-muted)]">{p.description}</div>
                      </td>
                      <td className="p-4 font-semibold text-emerald-700">₹{p.member_price}</td>
                      <td className="p-4 font-semibold text-[var(--color-ink)]">₹{p.non_member_price || p.member_price}</td>
                      <td className="p-4 text-[var(--color-muted)] font-medium">{p.stock_quantity ?? 'Unlimited'}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(p.product_id)}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Merchandise Orders Review */}
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <h3 className="font-semibold text-[var(--color-ink)]">Merchandise Orders & Payment Status</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase">
                    <th className="text-left p-4">Order ID & Date</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Items Ordered</th>
                    <th className="text-left p-4">Total Amount</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                  {merchOrders.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No merchandise orders placed yet.</td></tr>
                  ) : merchOrders.map(o => (
                    <tr key={o.order_id} className="hover:bg-zinc-50/50">
                      <td className="p-4">
                        <div className="font-semibold text-[var(--color-ink)]">#{o.order_id}</div>
                        <div className="text-xs text-[var(--color-muted)]">{new Date(o.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[var(--color-ink)]">{o.customer_name || 'Guest Attendee'}</div>
                        <div className="text-xs text-[var(--color-muted)]">{o.customer_email || ''}</div>
                      </td>
                      <td className="p-4 text-xs">
                        {o.items?.map((item, i) => (
                          <div key={i}>{item.product_name} × {item.quantity}</div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-[var(--color-ink)]">₹{o.total_amount}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 6: ORGANIZE FUNDRAISERS (Area F) ─── */}
        {activeTab === 'fundraisers' && (
          <div className="space-y-8">
            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6 shadow-sm">
              <h2 className="font-semibold text-[var(--color-ink)] text-base mb-4">Plan New Fundraiser</h2>
              <form onSubmit={handleCreateFundraiser} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <label className="block md:col-span-2">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Fundraiser Activity Title *</span>
                  <Input 
                    required 
                    value={fundraiserForm.title} 
                    onChange={e => setFundraiserForm(f => ({ ...f, title: e.target.value }))} 
                    placeholder="e.g. Annual Bake Sale & Charity Drive" 
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Description & Objectives</span>
                  <textarea 
                    className="w-full min-h-16 rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-3 text-sm"
                    value={fundraiserForm.description} 
                    onChange={e => setFundraiserForm(f => ({ ...f, description: e.target.value }))} 
                    placeholder="Outline preparation tasks, supplies needed, and goal details..." 
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 font-semibold text-[var(--color-ink)]">Fundraising Goal (₹) *</span>
                  <Input 
                    type="number" 
                    required 
                    value={fundraiserForm.goal_amount} 
                    onChange={e => setFundraiserForm(f => ({ ...f, goal_amount: e.target.value }))} 
                    placeholder="5000" 
                  />
                </label>
                <div className="md:col-span-2 pt-2">
                  <Button type="submit">Create Fundraiser</Button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <h3 className="font-semibold text-[var(--color-ink)]">Fundraisers & Progress</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] text-xs text-[var(--color-muted)] uppercase">
                    <th className="text-left p-4">Fundraiser</th>
                    <th className="text-left p-4">Goal</th>
                    <th className="text-left p-4">Collected</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-hairline-soft)]">
                  {fundraisers.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No fundraisers created yet.</td></tr>
                  ) : fundraisers.map(f => (
                    <tr key={f.fundraiser_id} className="hover:bg-zinc-50/50">
                      <td className="p-4">
                        <div className="font-semibold text-[var(--color-ink)]">{f.title}</div>
                        <div className="text-xs text-[var(--color-muted)]">{f.description}</div>
                      </td>
                      <td className="p-4 font-semibold text-[var(--color-ink)]">₹{f.goal_amount}</td>
                      <td className="p-4 font-bold text-emerald-700">₹{f.current_amount || 0}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-zinc-100 text-zinc-800">
                          {f.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteFundraiser(f.fundraiser_id)}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

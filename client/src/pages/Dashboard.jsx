import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, getUserMembership, getOrders, updateProfile } from '../lib/api';
import { useAuth } from '../lib/auth';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      getProfile(token).then(d => { setProfile(d); setProfileForm({ full_name: d.full_name || '', phone: d.phone || '' }); }).catch(() => {}),
      getUserMembership(token).then(d => setMembership(d)).catch(() => {}),
      getOrders(token, { limit: 3 }).then(d => setOrders(d.orders || [])).catch(() => {})
    ]).finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
        <TopNav />
        <main className="flex-1 py-[48px] px-6 max-w-[1200px] mx-auto w-full">
           <div className="animate-pulse flex flex-col gap-8">
             <div className="h-12 bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] w-1/3"></div>
             <div className="h-64 bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] w-full"></div>
           </div>
        </main>
      </div>
    );
  }

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const updated = await updateProfile(token, profileForm);
      setProfile(updated);
      setEditingProfile(false);
      setProfileMessage('Profile updated.');
    } catch (error) {
      setProfileMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />
      <main className="flex-1 py-[48px] px-6">
        <div className="max-w-[1000px] mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <h1 className="text-[36px] font-semibold tracking-[-1px] text-[var(--color-ink)]">
              Welcome, {profile?.full_name || 'User'}
            </h1>
            <div className="text-[14px] text-[var(--color-muted)]">
              {profile?.role === 'treasurer' ? 'Treasurer Account' : profile?.role === 'club_leader' ? 'Leader Account' : 'Member Account'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Profile Overview */}
            <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6 md:col-span-2">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Your Details</h2><Button variant="text" className="text-sm" onClick={() => setEditingProfile((value) => !value)}>{editingProfile ? 'Cancel' : 'Edit profile'}</Button></div>
              {profileMessage && <p role="status" className="mb-4 text-sm text-[var(--color-muted)]">{profileMessage}</p>}
              {editingProfile ? <form onSubmit={saveProfile} className="grid grid-cols-1 gap-4 text-[14px] sm:grid-cols-2"><label><span className="mb-1 block text-[var(--color-muted)]">Full name</span><input className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3" value={profileForm.full_name} onChange={(event) => setProfileForm((form) => ({ ...form, full_name: event.target.value }))} required /></label><label><span className="mb-1 block text-[var(--color-muted)]">Phone</span><input className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3" value={profileForm.phone} onChange={(event) => setProfileForm((form) => ({ ...form, phone: event.target.value }))} /></label><div className="sm:col-span-2"><Button type="submit">Save changes</Button></div></form> : <div className="grid grid-cols-2 gap-y-4 text-[14px]">
                <div>
                  <div className="text-[var(--color-muted)] mb-1">Email</div>
                  <div className="font-medium text-[var(--color-ink)]">{profile?.email}</div>
                </div>
                <div>
                  <div className="text-[var(--color-muted)] mb-1">Phone</div>
                  <div className="font-medium text-[var(--color-ink)]">{profile?.phone || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-[var(--color-muted)] mb-1">Member Since</div>
                  <div className="font-medium text-[var(--color-ink)]">{new Date(profile?.created_at).toLocaleDateString()}</div>
                </div>
              </div>}
            </div>

            {/* Membership */}
            <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
              <h2 className="text-[18px] font-semibold text-[var(--color-ink)] mb-4">Membership</h2>
              {membership ? (
                <div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium mb-3 ${membership.status === 'active' ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]' : 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'}`}>
                    {membership.status}
                  </div>
                  <div className="text-[16px] font-semibold text-[var(--color-ink)] mb-1">{membership.plan_name}</div>
                  {membership.end_date && (
                    <div className="text-[13px] text-[var(--color-muted)]">Expires {new Date(membership.end_date).toLocaleDateString()}</div>
                  )}
                </div>
              ) : (
                <div className="text-[14px] text-[var(--color-muted)]">
                  <p className="mb-4">You don't have an active membership.</p>
                  <Link to="/memberships"><Button variant="secondary" className="w-full">Join Now</Button></Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions for Leaders */}
          {(profile?.role === 'treasurer' || profile?.role === 'club_leader' || profile?.role === 'volunteer') && (
            <div className="mb-8 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
              <h2 className="text-[18px] font-semibold text-[var(--color-ink)] mb-4">Admin Actions</h2>
              <div className="flex gap-4 flex-wrap">
                <Link to="/check-in"><Button variant="secondary">Ticket Check-In</Button></Link>
                {profile?.role === 'treasurer' && <Link to="/finance"><Button variant="secondary">Finance Dashboard</Button></Link>}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Recent Orders</h2>
              {orders.length > 0 && <Link to="/orders" className="text-[14px] text-[var(--color-brand-accent)] font-medium">View all</Link>}
            </div>
            
            {orders.length === 0 ? (
              <div className="text-[14px] text-[var(--color-muted)] py-4 text-center">No orders yet.</div>
            ) : (
              <div className="divide-y divide-[var(--color-hairline)]">
                {orders.map(order => (
                  <div key={order.order_id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--color-ink)]">Order #{order.order_id}</div>
                      <div className="text-[13px] text-[var(--color-muted)]">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]' : 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'}`}>
                        {order.status}
                      </span>
                      <Link to={`/orders/${order.order_id}`}><Button variant="secondary" className="h-8 text-[12px] px-3">View</Button></Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}

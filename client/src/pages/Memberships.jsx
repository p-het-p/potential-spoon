import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getMembershipPlans, getUserMembership, createMembership } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Memberships() {
  const { token, isGuest } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [userMembership, setUserMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({ student_id: '', department: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetches = [getMembershipPlans().then((d) => setPlans(d.plans || []))];
    if (token) {
      fetches.push(getUserMembership(token).then((d) => setUserMembership(d)).catch(() => {}));
    }
    Promise.all(fetches).finally(() => setLoading(false));
  }, [token]);

  const handleJoin = async (planId) => {
    if (!token) {
      navigate('/register');
      return;
    }
    setJoining(planId);
    setError(null);
    try {
      await createMembership(token, { plan_id: planId, ...formData });
      setSuccess('Membership activated successfully! Welcome to the club.');
      setShowForm(null);
      if (token) getUserMembership(token).then((d) => setUserMembership(d)).catch(() => {});
    } catch (err) {
      setError(err.message || 'Could not complete membership registration');
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
      <TopNav />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 text-xs font-bold uppercase tracking-wider mb-3 border border-violet-100">
              <Sparkles size={14} className="text-violet-600" />
              <span>Path B: Join the Club</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-ink)] mb-4">
              Membership Plans
            </h1>
            <p className="text-base text-[var(--color-muted)] leading-relaxed">
              Join the club to get member pricing on all events and merchandise, vote on club decisions, and unlock the student member dashboard.
            </p>
          </div>

          {/* Active Membership Banner */}
          {userMembership && (
            <div className="max-w-xl mx-auto mb-10 bg-emerald-50 border border-emerald-200 rounded-[24px] p-6 text-emerald-950">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 text-emerald-800">
                  <CheckCircle size={14} /> Active Membership
                </span>
                <Link to="/dashboard">
                  <Button variant="secondary" className="h-8 text-xs font-bold bg-white text-emerald-900 border-emerald-200">
                    Open Member Dashboard →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-700 block">Plan:</span>
                  <span className="font-bold text-sm">{userMembership.plan_name}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block">Status:</span>
                  <span className="font-bold text-sm capitalize">{userMembership.status}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="max-w-xl mx-auto mb-6 p-6 bg-emerald-50 text-emerald-900 text-sm font-medium rounded-[24px] border border-emerald-200 text-center space-y-4">
              <div className="size-12 rounded-full bg-emerald-600 text-white grid place-items-center mx-auto">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Membership Activated!</h3>
                <p className="text-xs text-emerald-800 mt-1">{success}</p>
              </div>
              <Link to="/dashboard">
                <Button variant="primary" className="h-10 text-xs font-bold">
                  Open Member Dashboard →
                </Button>
              </Link>
            </div>
          )}

          {/* Unauthenticated Guide Banner */}
          {!token && (
            <div className="max-w-2xl mx-auto mb-10 p-5 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] text-center text-xs text-[var(--color-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="font-bold text-[var(--color-ink)] block text-sm">Create an account to join</span>
                <span>Membership requires an account for your profile and dues payment.</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/register">
                  <Button variant="primary" className="h-9 text-xs font-bold">
                    Create Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="h-9 text-xs font-bold">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--color-surface-card)] rounded-[24px] p-8 animate-pulse h-72" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plans
                .filter((p) => p.is_active)
                .map((plan, idx) => {
                  const isFeatured = idx === 1 && plans.length > 1;
                  return (
                    <div
                      key={plan.id}
                      className={`rounded-[24px] p-8 flex flex-col relative ${
                        isFeatured
                          ? 'bg-[var(--color-surface-dark)] text-white shadow-xl'
                          : 'bg-[var(--color-canvas)] border-2 border-[var(--color-hairline)]'
                      }`}
                    >
                      {isFeatured && (
                        <span className="absolute top-4 right-4 bg-violet-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}

                      <h3 className={`text-xl font-bold mb-2 ${isFeatured ? 'text-white' : 'text-[var(--color-ink)]'}`}>
                        {plan.name}
                      </h3>

                      <div className={`text-3xl font-extrabold tracking-tight mb-1 ${isFeatured ? 'text-white' : 'text-[var(--color-ink)]'}`}>
                        ₹{plan.dues_amount}
                      </div>

                      <div className={`text-xs mb-6 ${isFeatured ? 'text-zinc-400' : 'text-[var(--color-muted)]'}`}>
                        Valid for {plan.duration_days} days
                      </div>

                      <div className="mt-auto">
                        {showForm === plan.id ? (
                          <div className="space-y-3">
                            <Input
                              placeholder="Student ID (optional)"
                              value={formData.student_id}
                              onChange={(e) => setFormData((p) => ({ ...p, student_id: e.target.value }))}
                              className="h-10 text-xs bg-white text-zinc-900"
                            />
                            <Input
                              placeholder="Department (optional)"
                              value={formData.department}
                              onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                              className="h-10 text-xs bg-white text-zinc-900"
                            />
                            <Button
                              variant="primary"
                              className="w-full h-10 text-xs font-bold"
                              onClick={() => handleJoin(plan.id)}
                              disabled={joining === plan.id}
                            >
                              {joining === plan.id ? 'Activating...' : 'Confirm & Pay Dues'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant={isFeatured ? 'solid' : 'primary'}
                            className={`w-full h-10 text-xs font-bold ${
                              isFeatured ? 'bg-white text-zinc-950 hover:bg-zinc-200' : ''
                            }`}
                            disabled={!!userMembership}
                            onClick={() => {
                              if (!token) {
                                navigate('/register');
                              } else {
                                setShowForm(plan.id);
                              }
                            }}
                          >
                            {userMembership ? 'Already Active' : token ? 'Join Plan' : 'Sign up to Join'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Visitor Note (Path C) */}
          <div className="mt-16 text-center text-xs text-[var(--color-muted)] max-w-md mx-auto">
            <span>Not ready to join? You can attend any public campus event as a guest. </span>
            <Link to="/events" className="font-bold text-[var(--color-ink)] underline hover:text-[var(--color-brand-accent)]">
              Browse Events as Guest →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

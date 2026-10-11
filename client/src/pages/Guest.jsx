import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Mail,
  Ticket,
  ArrowRight,
  RotateCw,
  Sparkles,
  ShoppingBag,
  LogOut,
  Calendar,
  QrCode
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerGuest, sendGuestOtp, verifyGuestOtp, getCart } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Guest() {
  const navigate = useNavigate();
  const { attendee, attendeeId, isGuest, startGuestSession, clearGuestSession } = useAuth();
  const [step, setStep] = useState(isGuest ? 'dashboard' : 'register'); // register → otp → done | dashboard
  const [form, setForm] = useState({ email: '' });
  const [currentAttendeeId, setCurrentAttendeeId] = useState(attendeeId || null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isGuest && attendee) {
      setStep('dashboard');
      setCurrentAttendeeId(attendee.attendee_id);
      // Fetch cart items count
      getCart(null)
        .then((data) => setCartCount(data?.items?.length || 0))
        .catch(() => setCartCount(0));
    }
  }, [isGuest, attendee]);

  // Handle OTP cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const data = await registerGuest({ email: form.email.trim() });
      const id = data.attendee_id;
      setCurrentAttendeeId(id);

      if (data.email_verified) {
        const attendeeObj = {
          attendee_id: id,
          full_name: data.full_name || form.email.split('@')[0],
          email: data.email || form.email,
          email_verified: true,
        };
        startGuestSession(attendeeObj, null);
        navigate('/guest/pass');
      } else {
        const code = data.otp || '';
        setGeneratedOtp(code);
        if (code) setOtp(code);
        setCooldown(30);
        setStep('otp');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!currentAttendeeId || !otp) return;
    setError(null);
    setLoading(true);

    try {
      const result = await verifyGuestOtp(currentAttendeeId, otp);
      const attendeeObj = {
        attendee_id: currentAttendeeId,
        full_name: form.email.split('@')[0],
        email: form.email,
        email_verified: true,
      };
      startGuestSession(attendeeObj, result.session_token);
      navigate('/guest/pass');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !currentAttendeeId) return;
    setError(null);
    try {
      const data = await sendGuestOtp(currentAttendeeId);
      const code = data?.otp || '';
      if (code) {
        setGeneratedOtp(code);
        setOtp(code);
      }
      setCooldown(30);
      setError('New verification code generated below.');
    } catch (err) {
      setError(err.message || 'Resend failed');
    }
  };

  const handleExitGuest = () => {
    clearGuestSession();
    setStep('register');
    setForm({ full_name: '', email: '', phone: '' });
    setCurrentAttendeeId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Title & Workflow Guide */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Non-Member Attendee Workflow</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Guest Attendee Portal
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
              No account required. Join any campus event as a guest with your email and attendee ID.
            </p>
          </div>

          {/* Workflow Steps Visual Tracker */}
          <div className="mb-10 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-accent)] mb-4 text-center">
              The 4-Step Guest Attendee Journey
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className={`p-3 rounded-xl border ${step === 'register' || step === 'otp' ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-900' : 'border-[var(--color-hairline)] bg-[var(--color-surface-soft)]'}`}>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Step 1</span>
                <span>Enter Attendee Info & OTP</span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                <span className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Step 2</span>
                <span>Select Non-Member Ticket</span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                <span className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Step 3</span>
                <span>Instant Payment & Confirmation</span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                <span className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Step 4</span>
                <span>Gate QR Pass Check-in</span>
              </div>
            </div>
          </div>

          {/* ── Active Attendee Dashboard State ── */}
          {step === 'dashboard' ? (
            <div className="rounded-[28px] border-2 border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-md p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Active Attendee Session</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-ink)]">
                    {attendee?.full_name || 'Guest Attendee'}
                  </h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    {attendee?.email}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] block mb-1">
                    Primary Key (PK)
                  </span>
                  <span className="font-mono text-sm font-extrabold bg-zinc-100 border border-[var(--color-hairline)] px-2.5 py-1 rounded-lg text-[var(--color-ink)]">
                    attendee_id: #{currentAttendeeId}
                  </span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-hairline)]">
                <Link to="/events" className="block">
                  <div className="p-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] hover:border-[var(--color-brand-accent)] transition-colors">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)] mb-1">
                      <Calendar size={16} className="text-[var(--color-brand-accent)]" />
                      <span>Browse Events</span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      Pick non-member tickets with seat capacity verification.
                    </p>
                  </div>
                </Link>

                <Link to="/cart" className="block">
                  <div className="p-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] hover:border-[var(--color-brand-accent)] transition-colors">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)] mb-1">
                      <ShoppingBag size={16} className="text-emerald-600" />
                      <span>Your Guest Cart ({cartCount})</span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      Review reserved tickets and complete payment.
                    </p>
                  </div>
                </Link>

                <Link to="/guest/pass" className="block sm:col-span-2">
                  <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/60 hover:bg-emerald-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0">
                        <QrCode size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-950">Your Digital Guest Pass</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">Ready</span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          View QR code, print, or download your official digital entrance pass.
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-emerald-700 shrink-0 ml-2" />
                  </div>
                </Link>
              </div>

              {/* Conversion to Full Member Card (Path B) */}
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-violet-950 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-violet-700" />
                    <span>Ready to Join the Club? (Path B)</span>
                  </h3>
                  <p className="text-xs text-violet-800 mt-1">
                    Register a permanent account to unlock member discounts on all future events.
                  </p>
                </div>
                <Link to="/register">
                  <Button variant="primary" className="text-xs font-bold h-9 whitespace-nowrap">
                    Join the Club
                  </Button>
                </Link>
              </div>

              {/* Exit Guest Mode Action (Path C) */}
              <div className="pt-2 flex justify-between items-center text-xs text-[var(--color-muted)]">
                <span>Want to browse as regular visitor?</span>
                <button
                  onClick={handleExitGuest}
                  className="font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Exit Guest Mode</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── Registration / OTP Verification Card ── */
            <div className="w-full max-w-md mx-auto bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[24px] shadow-sm p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                  {step === 'register' && 'Enter Attendee Details'}
                  {step === 'otp' && 'Verify Email Address'}
                  {step === 'done' && 'Attendee Verified!'}
                </h2>
                <p className="text-xs text-[var(--color-muted)] mt-1.5">
                  {step === 'register' && 'No password required. Enter your name and email to proceed.'}
                  {step === 'otp' && `We sent a 6-digit code to ${form.email}`}
                  {step === 'done' && `Attendee ID #${currentAttendeeId} is now active.`}
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Step: Register */}
              {step === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@campus.edu"
                      className="h-11"
                      autoFocus
                    />
                    <span className="mt-1 block text-[11px] text-[var(--color-muted)]">
                      Your tickets and QR access passes will be sent to this email.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !form.email.trim()}
                    className="w-full h-11 text-sm font-semibold mt-2"
                  >
                    {loading ? 'Generating Code...' : 'Get 6-Digit Code →'}
                  </Button>
                </form>
              )}

              {/* Step: OTP */}
              {step === 'otp' && (
                <form onSubmit={handleVerify} className="space-y-4">
                  {generatedOtp && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Random OTP Generated in Backend
                      </span>
                      <div className="my-1.5 font-mono text-3xl font-black tracking-[0.3em] text-emerald-950">
                        {generatedOtp}
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtp(generatedOtp)}
                        className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                      >
                        Click to fill into input
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-2 text-center">
                      Verification Code
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      className="h-14 text-center text-2xl tracking-[0.4em] font-mono font-bold"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || otp.length !== 6}
                    className="w-full h-11 text-sm font-semibold"
                  >
                    {loading ? 'Verifying...' : 'Verify Email & Activate'}
                  </Button>

                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('register')}
                      className="hover:text-[var(--color-ink)] underline cursor-pointer"
                    >
                      Change info
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0}
                      className="hover:text-[var(--color-ink)] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw size={12} className={cooldown > 0 ? 'animate-spin' : ''} />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step: Done */}
              {step === 'done' && (
                <div className="text-center space-y-5">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto">
                    <CheckCircle size={32} />
                  </div>

                  <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 text-left text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[var(--color-muted)] font-medium">Attendee Primary Key:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-[var(--color-hairline)]">
                        attendee_id #{currentAttendeeId}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-[var(--color-ink)]">{attendee?.full_name || form.email.split('@')[0]}</div>
                    <div className="text-[var(--color-muted)]">{form.email}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to="/events">
                      <Button variant="primary" className="w-full h-11 text-sm font-semibold">
                        Browse Events & Buy Tickets →
                      </Button>
                    </Link>
                    <button
                      onClick={() => setStep('dashboard')}
                      className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] py-2 cursor-pointer"
                    >
                      View Attendee Portal
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] text-center text-xs text-[var(--color-muted)]">
                Have a member account?{' '}
                <Link to="/login" className="font-bold text-[var(--color-ink)] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Mail, ArrowRight, RotateCw, Ticket, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { registerGuest, sendGuestOtp, verifyGuestOtp } from '../../lib/api';
import { useAuth } from '../../lib/auth';

export function AttendeeModal({ isOpen, onClose, initialEvent = null, onVerified = null }) {
  const { attendee, attendeeId, startGuestSession } = useAuth();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [currentAttendeeId, setCurrentAttendeeId] = useState(attendeeId || null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (attendee?.email) {
        setEmail(attendee.email);
        setCurrentAttendeeId(attendee.attendee_id);
      }
    }
  }, [isOpen, attendee]);

  // Handle OTP cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const data = await registerGuest({ email: email.trim() });
      const id = data.attendee_id;
      setCurrentAttendeeId(id);

      if (data.email_verified) {
        const attendeeObj = {
          attendee_id: id,
          full_name: data.full_name || email.split('@')[0],
          email: data.email || email,
          email_verified: true,
        };
        startGuestSession(attendeeObj, null);
        setStep('success');
        if (onVerified) onVerified(attendeeObj);
      } else {
        const code = data.otp || '';
        setGeneratedOtp(code);
        if (code) setOtp(code);
        setCooldown(30);
        setStep('otp');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!currentAttendeeId || !otp) return;
    setError(null);
    setLoading(true);

    try {
      const result = await verifyGuestOtp(currentAttendeeId, otp);
      const attendeeObj = {
        attendee_id: currentAttendeeId,
        full_name: email.split('@')[0],
        email: email,
        email_verified: true,
      };
      startGuestSession(attendeeObj, result.session_token);
      setStep('success');
      if (onVerified) onVerified(attendeeObj);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
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
    } catch (err) {
      setError(err.message || 'Could not resend OTP code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[24px] shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 size-9 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Guest Ticket Checkout</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
          {step === 'email' && 'Verify Email to Continue'}
          {step === 'otp' && 'Enter Verification Code'}
          {step === 'success' && 'Guest Verified!'}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed">
          {step === 'email' && 'No password required. Enter your email to quickly purchase event tickets.'}
          {step === 'otp' && `Code generated for ${email}`}
          {step === 'success' && `Attendee ID #${currentAttendeeId} is now active.`}
        </p>

        {initialEvent && (
          <div className="mt-3.5 p-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] flex items-center gap-3">
            <div className="size-9 rounded-lg bg-[var(--color-primary)] text-white grid place-items-center shrink-0">
              <Ticket size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-[var(--color-brand-accent)] uppercase tracking-wider">Non-Member Pass</p>
              <p className="text-xs font-bold text-[var(--color-ink)] truncate">{initialEvent.title}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 flex items-start gap-2">
            <span className="text-red-500 font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Just Email */}
        {step === 'email' && (
          <form onSubmit={handleRegister} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 pl-9 text-sm"
                />
                <Mail size={16} className="absolute left-3 top-3 text-[var(--color-muted)]" />
              </div>
              <span className="mt-1 block text-[11px] text-[var(--color-muted)]">
                Your ticket and QR entry code will be linked to this email.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email.trim()}
              className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Generating Code...' : (
                <>
                  <span>Get Verification Code</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Step 2: Display Backend Generated OTP Popup + Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3.5">
            {/* 6-digit Code Display Popup Banner */}
            {generatedOtp && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  <KeyRound size={13} className="text-emerald-600" />
                  <span>Backend OTP Code</span>
                </div>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1.5 text-center">
                6-Digit Verification Code
              </label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
                className="h-12 text-center text-xl tracking-[0.3em] font-mono font-bold"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || otp.length !== 6}
              className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Code...' : 'Verify & Continue to Ticket'}
            </Button>

            <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-1">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="hover:text-[var(--color-ink)] underline cursor-pointer"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0}
                className="hover:text-[var(--color-ink)] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RotateCw size={12} className={cooldown > 0 ? 'animate-spin' : ''} />
                {cooldown > 0 ? `Resend (${cooldown}s)` : 'New code'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="mt-5 text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto animate-in zoom-in-75">
              <CheckCircle size={28} />
            </div>

            <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[var(--color-muted)] font-medium">Attendee ID:</span>
                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-[var(--color-hairline)] text-[var(--color-ink)]">
                  #{currentAttendeeId}
                </span>
              </div>
              <div className="text-xs text-[var(--color-muted)] truncate">{email}</div>
            </div>

            <Button
              variant="primary"
              onClick={onClose}
              className="w-full h-11 text-sm font-semibold"
            >
              Continue with Ticket Purchase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

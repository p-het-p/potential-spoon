import { useState, useRef, useEffect } from 'react';
import './ForgotPassword.css';

/* ══════════════════════════════════════════
   SVG Icons
══════════════════════════════════════════ */
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3L22 7l-3-3"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IconShieldKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <circle cx="12" cy="11" r="2"/>
    <path d="M12 13v3"/>
  </svg>
);

/* ══════════════════════════════════════════
   Password strength
══════════════════════════════════════════ */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: 'Too short', color: 'var(--clr-error)' },
    { label: 'Weak',      color: '#f97316' },
    { label: 'Fair',      color: '#eab308' },
    { label: 'Good',      color: '#22c55e' },
    { label: 'Strong',    color: '#06b6d4' },
  ];
  return { score: s, ...map[s] };
}

/* ══════════════════════════════════════════
   Steps config
══════════════════════════════════════════ */
const STEPS = [
  { id: 1, label: 'Request' },
  { id: 2, label: 'Verify'  },
  { id: 3, label: 'Reset'   },
];

/* ══════════════════════════════════════════
   OTP Input — 6 individual digit boxes
══════════════════════════════════════════ */
function OtpInput({ value, onChange, hasError, disabled }) {
  const refs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const focus = (i) => refs.current[i]?.focus();

  const handleChange = (e, i) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = ch || ' ';
    onChange(next.join('').trimEnd());
    if (ch && i < 5) focus(i + 1);
  };

  const handleKey = (e, i) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i].trim()) {
        next[i] = ' ';
        onChange(next.join('').trimEnd());
      } else if (i > 0) {
        next[i - 1] = ' ';
        onChange(next.join('').trimEnd());
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft'  && i > 0) focus(i - 1);
    else if (e.key === 'ArrowRight' && i < 5) focus(i + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(raw);
    focus(Math.min(raw.length, 5));
  };

  return (
    <div
      className={`otp-row${hasError ? ' has-error' : ''}`}
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          id={`otp-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`otp-box${d.trim() ? ' otp-filled' : ''}`}
          value={d.trim()}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1} of 6`}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main ForgotPassword component
══════════════════════════════════════════ */
export default function ForgotPassword({ onSignIn }) {
  const [step,      setStep]      = useState(1);
  const [direction, setDirection] = useState('forward');
  const [animKey,   setAnimKey]   = useState(0); // forces re-mount for animation

  // Field state
  const [email,     setEmail]     = useState('');
  const [otp,       setOtp]       = useState(''); // 6-box OTP
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew,   setShowNew]   = useState(false);
  const [showConf,  setShowConf]  = useState(false);

  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [codeSent,  setCodeSent]  = useState(false);
  const [cooldown,  setCooldown]  = useState(0);
  const [done,      setDone]      = useState(false);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Navigate between steps with direction tracking
  const goTo = (next, dir = 'forward') => {
    setDirection(dir);
    setAnimKey(k => k + 1);
    setStep(next);
    setErrors({});
  };

  /* ─────────────────────────────────────────
     STEP 1 — Send code
  ───────────────────────────────────────── */
  const handleSendCode = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim())
      errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setCodeSent(true);
    setCooldown(60);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setOtp('');
    setCooldown(60);
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim())
      errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.';
    if (!codeSent)
      errs.send = 'Please send the reset code first.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goTo(2);
  };

  /* ─────────────────────────────────────────
     STEP 2 — Verify code (OTP boxes + text fallback)
  ───────────────────────────────────────── */
  const handleVerify = async (e) => {
    e.preventDefault();
    const errs = {};
    const otpVal = otp.replace(/\s/g, '');
    if (otpVal.length < 6)
      errs.code = 'Please enter the complete 6-digit verification code.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    goTo(3);
  };

  /* ─────────────────────────────────────────
     STEP 3 — New password
  ───────────────────────────────────────── */
  const handleReset = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPw)
      errs.newPw = 'New password is required.';
    else if (newPw.length < 8)
      errs.newPw = 'Password must be at least 8 characters.';
    if (!confirmPw)
      errs.confirmPw = 'Please confirm your password.';
    else if (newPw !== confirmPw)
      errs.confirmPw = 'Passwords do not match.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setDone(true);
  };

  const strength = getStrength(newPw);

  /* ══════════════════════════════════════════
     SUCCESS screen
  ══════════════════════════════════════════ */
  if (done) {
    return (
      <div className="fp-page">
        <div className="blob blob-1" aria-hidden="true"/>
        <div className="blob blob-2" aria-hidden="true"/>
        <div className="blob blob-3" aria-hidden="true"/>
        <div className="fp-card success-card" role="main">
          <div className="success-ring" aria-hidden="true">
            <IconCheck/>
          </div>
          <h1 className="fp-title">All done!</h1>
          <p className="fp-subtitle">Your password has been reset successfully.<br/>You can now sign in with your new password.</p>
          <button id="backToSignInBtn" className="btn btn-primary" onClick={onSignIn}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     MAIN multi-step card
  ══════════════════════════════════════════ */
  return (
    <div className="fp-page">
      <div className="blob blob-1" aria-hidden="true"/>
      <div className="blob blob-2" aria-hidden="true"/>
      <div className="blob blob-3" aria-hidden="true"/>

      <div className="fp-card" role="main">

        {/* Logo */}
        <div className="fp-logo" aria-hidden="true">
          <span className="logo-icon"><IconShieldKey/></span>
        </div>

        {/* ── Step indicator bar ── */}
        <nav className="step-nav" aria-label="Password reset progress">
          {STEPS.map((s, i) => (
            <div key={s.id} className="step-item">
              <div
                className={`step-circle ${step > s.id ? 'step-done' : step === s.id ? 'step-active' : 'step-pending'}`}
                aria-current={step === s.id ? 'step' : undefined}
                aria-label={`Step ${s.id}: ${s.label}${step > s.id ? ' – completed' : step === s.id ? ' – current' : ''}`}
              >
                {step > s.id ? <IconCheck/> : <span>{s.id}</span>}
              </div>
              <span className={`step-label ${step === s.id ? 'step-label-active' : ''}`}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`step-connector ${step > s.id ? 'connector-done' : ''}`} aria-hidden="true"/>
              )}
            </div>
          ))}
        </nav>

        {/* ── Animated step panel ── */}
        <div
          key={animKey}
          className={`step-content ${direction === 'forward' ? 'anim-forward' : 'anim-back'}`}
          aria-live="polite"
        >

          {/* ══════════ STEP 1 – Email + Send Code ══════════ */}
          {step === 1 && (
            <form id="fp-step1-form" onSubmit={handleStep1Next} noValidate aria-label="Step 1: Request reset code">
              <h1 className="fp-title">Forgot password?</h1>
              <p className="fp-subtitle">Enter your registered email address and we'll send you a reset code.</p>

              {/* Email field */}
              <div className={`field-group${errors.email ? ' has-error' : ''}`}>
                <label htmlFor="fp-email" className="field-label">Registered Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMail/></span>
                  <input
                    id="fp-email"
                    type="email"
                    className="field-input"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(er => ({...er, email: ''})); }}
                    autoComplete="email"
                    aria-required="true"
                    autoFocus
                  />
                  {/* inline Send Code button */}
                  <button
                    id="sendCodeInlineBtn"
                    type="button"
                    className="inline-send-btn"
                    onClick={handleSendCode}
                    disabled={loading || codeSent}
                    aria-label="Send reset code"
                    title={codeSent ? 'Code sent!' : 'Send reset code'}
                  >
                    {loading ? <span className="spinner-sm"/> : codeSent ? <IconCheck/> : <IconArrowRight/>}
                  </button>
                </div>
                {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
              </div>

              {/* Code-sent status / resend */}
              {codeSent && (
                <div className="code-sent-banner" role="status" aria-live="polite">
                  <span className="banner-dot" aria-hidden="true"/>
                  Code sent to <strong>{email}</strong>.&nbsp;
                  {cooldown > 0
                    ? <span className="resend-countdown">Resend in {cooldown}s</span>
                    : <button id="resendBtn" type="button" className="resend-btn" onClick={handleResend} disabled={loading}>
                        Resend
                      </button>
                  }
                </div>
              )}

              {errors.send && <span className="field-error" role="alert">{errors.send}</span>}

              <button
                id="step1NextBtn"
                type="submit"
                className="btn btn-primary"
                disabled={loading || !codeSent}
                aria-busy={loading}
              >
                {loading ? <span className="spinner"/> : <>Continue <IconArrowRight/></>}
              </button>

              <p className="fp-back-link">
                <a href="#signin" id="step1BackLink" className="back-link"
                  onClick={e => { e.preventDefault(); if (onSignIn) onSignIn(); }}>
                  <IconArrowLeft/> Back to Sign In
                </a>
              </p>
            </form>
          )}

          {/* ══════════ STEP 2 – Verification Code ══════════ */}
          {step === 2 && (
            <form id="fp-step2-form" onSubmit={handleVerify} noValidate aria-label="Step 2: Enter verification code">
              <h1 className="fp-title">Enter verification code</h1>
              <p className="fp-subtitle">
                We sent a 6-digit code to <strong className="email-highlight">{email}</strong>.<br />
                Enter the code below to proceed.
              </p>

              {/* ── 6-digit OTP boxes ── */}
              <div className={`field-group${errors.code ? ' has-error' : ''}`}>
                <label className="field-label" style={{ justifyContent: 'center' }}>
                  <span className="label-icon" aria-hidden="true"><IconKey/></span>
                  Verification Code
                </label>
                <OtpInput
                  value={otp}
                  onChange={v => { setOtp(v); setErrors(er => ({...er, code: ''})); }}
                  hasError={!!errors.code}
                  disabled={loading}
                />
                {errors.code && (
                  <span className="field-error" style={{ textAlign: 'center' }} role="alert">
                    {errors.code}
                  </span>
                )}
              </div>

              {/* Resend row */}
              <div className="resend-row">
                <span className="resend-text">Didn't receive a code?</span>
                {cooldown > 0
                  ? <span className="resend-countdown">Resend in {cooldown}s</span>
                  : <button id="resendCodeBtn" type="button" className="resend-btn" onClick={handleResend} disabled={loading}>
                      Resend code
                    </button>
                }
              </div>

              <button id="verifyCodeBtn" type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
                {loading ? <span className="spinner"/> : <>Verify Code <IconArrowRight/></>}
              </button>

              <p className="fp-back-link">
                <a href="#back" id="step2BackLink" className="back-link"
                  onClick={e => { e.preventDefault(); goTo(1, 'back'); }}>
                  <IconArrowLeft/> Change email
                </a>
              </p>
            </form>
          )}

          {/* ══════════ STEP 3 – New Password ══════════ */}
          {step === 3 && (
            <form id="fp-step3-form" onSubmit={handleReset} noValidate aria-label="Step 3: Set new password">
              <h1 className="fp-title">Set new password</h1>
              <p className="fp-subtitle">Choose a strong password — at least 8 characters.</p>

              {/* New password */}
              <div className={`field-group${errors.newPw ? ' has-error' : ''}`}>
                <label htmlFor="fp-new-password" className="field-label">New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock/></span>
                  <input
                    id="fp-new-password"
                    type={showNew ? 'text' : 'password'}
                    className="field-input"
                    placeholder="Min. 8 characters"
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setErrors(er => ({...er, newPw: ''})); }}
                    autoComplete="new-password"
                    aria-required="true"
                    autoFocus
                  />
                  <button id="newPasswordToggle" type="button" className="toggle-btn"
                    onClick={() => setShowNew(p => !p)}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                    aria-pressed={showNew}>
                    {showNew ? <IconEyeOff/> : <IconEye/>}
                  </button>
                </div>
                {newPw && (
                  <div className="strength-meter" aria-label={`Strength: ${strength.label}`}>
                    <div className="strength-bars">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="strength-bar"
                          style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)' }}/>
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.newPw && <span className="field-error" role="alert">{errors.newPw}</span>}
              </div>

              {/* Confirm password */}
              <div className={`field-group${errors.confirmPw ? ' has-error' : ''}`}>
                <label htmlFor="fp-confirm-password" className="field-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock/></span>
                  <input
                    id="fp-confirm-password"
                    type={showConf ? 'text' : 'password'}
                    className="field-input"
                    placeholder="Re-enter your password"
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setErrors(er => ({...er, confirmPw: ''})); }}
                    autoComplete="new-password"
                    aria-required="true"
                  />
                  <button id="confirmPasswordToggle" type="button" className="toggle-btn"
                    onClick={() => setShowConf(p => !p)}
                    aria-label={showConf ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConf}>
                    {showConf ? <IconEyeOff/> : <IconEye/>}
                  </button>
                </div>
                {confirmPw && (
                  <span className={`match-hint ${newPw === confirmPw ? 'match-ok' : 'match-fail'}`}>
                    {newPw === confirmPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
                {errors.confirmPw && <span className="field-error" role="alert">{errors.confirmPw}</span>}
              </div>

              <button id="resetPasswordBtn" type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
                {loading ? <span className="spinner"/> : 'Reset Password'}
              </button>

              <p className="fp-back-link">
                <a href="#back" id="step3BackLink" className="back-link"
                  onClick={e => { e.preventDefault(); goTo(2, 'back'); }}>
                  <IconArrowLeft/> Back
                </a>
              </p>
            </form>
          )}

        </div>{/* end step-content */}
      </div>{/* end fp-card */}
    </div>
  );
}

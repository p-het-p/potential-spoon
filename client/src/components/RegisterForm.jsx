import { useState } from 'react';
import './RegisterForm.css';

/* ── SVG Icons ── */
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconId = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M16 10h2M16 14h2M6 10h.01M6 14h.01" />
    <circle cx="9" cy="12" r="2" />
    <path d="M6.5 17c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconGraduate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

/* ── Password strength meter ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Too short', color: 'var(--clr-error)' },
    { label: 'Weak',      color: '#f97316' },
    { label: 'Fair',      color: '#eab308' },
    { label: 'Good',      color: '#22c55e' },
    { label: 'Strong',    color: '#06b6d4' },
  ];
  return { score, ...levels[score] };
}

export default function RegisterForm({ onSignIn }) {
  const [form, setForm] = useState({
    fullName: '', email: '', studentId: '',
    password: '', confirmPassword: '', acceptTerms: false,
  });
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirm,  setShowConfirm]         = useState(false);
  const [errors, setErrors]                    = useState({});
  const [isLoading, setIsLoading]              = useState(false);
  const [verifyLoading, setVerifyLoading]      = useState(false);
  const [successMsg, setSuccessMsg]            = useState('');
  const [verifyMsg, setVerifyMsg]              = useState('');

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())
      errs.fullName = 'Full name is required.';
    else if (form.fullName.trim().length < 2)
      errs.fullName = 'Name must be at least 2 characters.';

    if (!form.email.trim())
      errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';

    if (!form.studentId.trim())
      errs.studentId = 'Student ID is required.';
    else if (!/^[A-Za-z0-9\-_]{3,20}$/.test(form.studentId.trim()))
      errs.studentId = 'Student ID must be 3-20 alphanumeric characters.';

    if (!form.password)
      errs.password = 'Password is required.';
    else if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters.';

    if (!form.confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';

    if (!form.acceptTerms)
      errs.acceptTerms = 'You must accept the Terms & Conditions.';

    return errs;
  };

  /* ── Create Account ── */
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsLoading(false);
    setSuccessMsg('Account created! Please check your email to verify.');
  };

  /* ── Verify Email ── */
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors(er => ({ ...er, email: 'Enter a valid email to verify.' }));
      return;
    }
    setVerifyLoading(true);
    setVerifyMsg('');
    await new Promise(r => setTimeout(r, 1200));
    setVerifyLoading(false);
    setVerifyMsg('Verification email sent to ' + form.email);
  };

  const strength = getStrength(form.password);

  return (
    <div className="reg-page">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <div className="reg-card" role="main">
        {/* Logo */}
        <div className="reg-logo" aria-hidden="true">
          <span className="logo-icon"><IconGraduate /></span>
        </div>

        <h1 className="reg-title">Create your account</h1>
        <p className="reg-subtitle">Join thousands of students learning today</p>

        {/* Success banner */}
        {successMsg && (
          <div className="alert-success" role="status" aria-live="polite">
            <span>&#10003;</span> {successMsg}
          </div>
        )}
        {verifyMsg && (
          <div className="alert-info" role="status" aria-live="polite">
            <span>&#9993;</span> {verifyMsg}
          </div>
        )}

        <form
          id="register-form"
          className="reg-form"
          onSubmit={handleCreateAccount}
          noValidate
          aria-label="Student registration form"
        >
          {/* ── Full Name ── */}
          <div className={`field-group ${errors.fullName ? 'has-error' : ''}`}>
            <label htmlFor="fullName" className="field-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconUser /></span>
              <input
                id="fullName"
                type="text"
                className="field-input"
                placeholder="Jane Smith"
                value={form.fullName}
                onChange={set('fullName')}
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
            </div>
            {errors.fullName && (
              <span id="fullName-error" className="field-error" role="alert">{errors.fullName}</span>
            )}
          </div>

          {/* ── Email ── */}
          <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="reg-email" className="field-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconMail /></span>
              <input
                id="reg-email"
                type="email"
                className="field-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                aria-required="true"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <button
                id="verifyEmailBtn"
                type="button"
                className="inline-verify-btn"
                onClick={handleVerifyEmail}
                disabled={verifyLoading}
                aria-label="Send verification email"
                title="Send verification email"
              >
                {verifyLoading ? <span className="spinner-sm" /> : 'Verify'}
              </button>
            </div>
            {errors.email && (
              <span id="email-error" className="field-error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* ── Student ID ── */}
          <div className={`field-group ${errors.studentId ? 'has-error' : ''}`}>
            <label htmlFor="studentId" className="field-label">Student ID</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconId /></span>
              <input
                id="studentId"
                type="text"
                className="field-input"
                placeholder="e.g. STU-20240001"
                value={form.studentId}
                onChange={set('studentId')}
                autoComplete="off"
                aria-required="true"
                aria-describedby={errors.studentId ? 'studentId-error' : undefined}
              />
            </div>
            {errors.studentId && (
              <span id="studentId-error" className="field-error" role="alert">{errors.studentId}</span>
            )}
          </div>

          {/* ── Password ── */}
          <div className={`field-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="reg-password" className="field-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconLock /></span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="password-strength"
              />
              <button
                id="passwordToggle"
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {/* Strength meter */}
            {form.password && (
              <div id="password-strength" className="strength-meter" aria-label={`Password strength: ${strength.label}`}>
                <div className="strength-bars">
                  {[1,2,3,4].map(i => (
                    <span
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)' }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {errors.password && (
              <span className="field-error" role="alert">{errors.password}</span>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div className={`field-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconLock /></span>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="field-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                autoComplete="new-password"
                aria-required="true"
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                id="confirmPasswordToggle"
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirm(p => !p)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showConfirm}
              >
                {showConfirm ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {/* Match indicator */}
            {form.confirmPassword && (
              <span className={`match-hint ${form.password === form.confirmPassword ? 'match-ok' : 'match-fail'}`}>
                {form.password === form.confirmPassword ? '&#10003; Passwords match' : '&#10007; Passwords do not match'}
              </span>
            )}
            {errors.confirmPassword && (
              <span id="confirmPassword-error" className="field-error" role="alert">{errors.confirmPassword}</span>
            )}
          </div>

          {/* ── Accept Terms ── */}
          <div className={`field-group ${errors.acceptTerms ? 'has-error' : ''}`}>
            <label htmlFor="acceptTerms" className="checkbox-label">
              <input
                id="acceptTerms"
                type="checkbox"
                className="checkbox-input"
                checked={form.acceptTerms}
                onChange={set('acceptTerms')}
                aria-required="true"
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span className="checkbox-text">
                I accept the&nbsp;
                <a href="#terms" id="termsLink" className="link-accent" onClick={e => e.preventDefault()}>
                  Terms &amp; Conditions
                </a>
                &nbsp;and&nbsp;
                <a href="#privacy" id="privacyLink" className="link-accent" onClick={e => e.preventDefault()}>
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <span className="field-error" role="alert" style={{ marginLeft: '30px' }}>{errors.acceptTerms}</span>
            )}
          </div>

          {/* ── Create Account button ── */}
          <button
            id="createAccountBtn"
            type="submit"
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <span className="spinner" aria-label="Creating account" /> : 'Create Account'}
          </button>

          {/* ── Verify Email button (standalone) ── */}
          <button
            id="verifyEmailStandaloneBtn"
            type="button"
            className={`btn btn-secondary ${verifyLoading ? 'btn-loading' : ''}`}
            onClick={handleVerifyEmail}
            disabled={verifyLoading}
            aria-busy={verifyLoading}
          >
            {verifyLoading ? <span className="spinner" aria-label="Sending verification" /> : 'Verify Email'}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="divider" aria-hidden="true">
          <span className="divider-line" />
          <span className="divider-text">Already a member?</span>
          <span className="divider-line" />
        </div>

        {/* ── Sign In link ── */}
        <p className="reg-footer">
          Already have an account?&nbsp;
          <a
            href="#signin"
            id="signInLink"
            className="link-accent"
            onClick={(e) => { e.preventDefault(); if (onSignIn) onSignIn(); }}
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import './AuthForm.css';

/* ── SVG icon helpers ── */
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default function AuthForm({ onRegister, onForgot }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim())
      errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email.';
    if (!password)
      errs.password = 'Password is required.';
    else if (password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setSuccessMsg('Signed in successfully! Redirecting...');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (onForgot) onForgot();
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (onRegister) onRegister();
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <div className="auth-card" role="main">
        <div className="auth-logo" aria-hidden="true">
          <span className="logo-icon"><IconShield /></span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {successMsg && (
          <div className="alert-success" role="status" aria-live="polite">
            <span>&#10003;</span> {successMsg}
          </div>
        )}

        <form
          id="signin-form"
          className="auth-form"
          onSubmit={handleSignIn}
          noValidate
          aria-label="Sign-in form"
        >
          <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email" className="field-label">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconMail /></span>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                aria-required="true"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="field-error" role="alert">{errors.email}</span>
            )}
          </div>

          <div className={`field-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password" className="field-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconLock /></span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-required="true"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                id="passwordToggle"
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="field-error" role="alert">{errors.password}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="rememberMe" className="checkbox-label">
              <input
                id="rememberMe"
                type="checkbox"
                className="checkbox-input"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span className="checkbox-text">Remember me</span>
            </label>

            <a
              href="#forgot"
              id="forgotPasswordLink"
              className="link-accent"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </a>
          </div>

          <button
            id="signInBtn"
            type="submit"
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading
              ? <span className="spinner" aria-label="Signing in" />
              : 'Sign In'}
          </button>
        </form>

        <div className="divider" aria-hidden="true">
          <span className="divider-line" />
          <span className="divider-text">or</span>
          <span className="divider-line" />
        </div>

        <button
          id="createAccountBtn"
          type="button"
          className="btn btn-outline"
          onClick={handleCreateAccount}
        >
          Create Account
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?&nbsp;
          <a
            href="#register"
            id="registerLink"
            className="link-accent"
            onClick={handleCreateAccount}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

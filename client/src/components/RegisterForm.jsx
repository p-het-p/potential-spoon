import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/control-ui/ui/card';
import { Button } from '@/components/control-ui/ui/button';
import { Input } from '@/components/control-ui/ui/input';
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/control-ui/ui/field';
import { Checkbox } from '@/components/control-ui/ui/checkbox';
import { Form } from '@/components/control-ui/ui/form';
import { InputGroup, InputGroupAddon } from '@/components/control-ui/ui/input-group';
import './RegisterForm.css';

/* ── SVG Icons ── */
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconId = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M16 10h2M16 14h2M6 10h.01M6 14h.01" />
    <circle cx="9" cy="12" r="2" />
    <path d="M6.5 17c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconGraduate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
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
    { label: 'Too short', color: '#ff6b6b' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#06b6d4' },
  ];
  return { score, ...levels[score] };
}

export default function RegisterForm({ onSignIn }) {
  const [form, setForm] = useState({
    fullName: '', email: '', studentId: '',
    password: '', confirmPassword: '', acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('');

  const set = (field) => (e) => {
    const val = e.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e;
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
    <div className="reg-page bg-gray-950 dark text-foreground min-h-screen flex items-center justify-center relative overflow-hidden p-6 font-sans">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <Card className="w-full max-w-[480px] relative z-10 bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl rounded-[24px] p-2 animate-in fade-in slide-in-from-bottom-6 duration-500 my-8">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 shadow-lg shadow-pink-500/30 mb-6">
            <IconGraduate />
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight mb-2">Create your account</CardTitle>
          <CardDescription className="text-center text-zinc-400">Join thousands of students learning today</CardDescription>
        </CardHeader>
        
        <CardContent>
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <span>&#10003;</span> {successMsg}
            </div>
          )}
          {verifyMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 p-3 mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <span>&#9993;</span> {verifyMsg}
            </div>
          )}

          <Form onSubmit={handleCreateAccount} className="space-y-5" noValidate>
            
            <Field invalid={!!errors.fullName}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Full Name</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconUser />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type="text"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={set('fullName')}
                      autoComplete="name"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                  </InputGroup>
                )}
              />
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.fullName}</FieldError>
            </Field>

            <Field invalid={!!errors.email}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Email Address</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconMail />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type="email"
                      placeholder="you@university.edu"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                    <InputGroupAddon className="pr-1.5">
                      <Button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={verifyLoading}
                        variant="quiet"
                        className="h-8 px-3 text-xs bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-medium rounded-lg"
                      >
                        {verifyLoading ? <div className="size-3.5 rounded-full border-2 border-pink-400/30 border-t-pink-400 animate-spin" /> : 'Verify'}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.email}</FieldError>
            </Field>

            <Field invalid={!!errors.studentId}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Student ID</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconId />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type="text"
                      placeholder="e.g. STU-20240001"
                      value={form.studentId}
                      onChange={set('studentId')}
                      autoComplete="off"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                  </InputGroup>
                )}
              />
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.studentId}</FieldError>
            </Field>

            <Field invalid={!!errors.password}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Password</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconLock />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={set('password')}
                      autoComplete="new-password"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                    <InputGroupAddon className="pr-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 rounded-md transition-colors"
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              {form.password && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex gap-1 flex-1 mr-3">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  <span className="text-[0.7rem] font-medium uppercase tracking-wider" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.password}</FieldError>
            </Field>

            <Field invalid={!!errors.confirmPassword}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Confirm Password</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconLock />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      autoComplete="new-password"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                    <InputGroupAddon className="pr-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 rounded-md transition-colors"
                      >
                        {showConfirm ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              {form.confirmPassword && (
                <div className={`mt-2 text-xs font-medium px-1 flex items-center gap-1.5 ${form.password === form.confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                </div>
              )}
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.confirmPassword}</FieldError>
            </Field>

            <Field invalid={!!errors.acceptTerms}>
              <div className="flex flex-col mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox 
                    checked={form.acceptTerms} 
                    onCheckedChange={set('acceptTerms')} 
                    className="size-5 rounded-md border-2 border-white/20 bg-white/5 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 transition-colors" 
                  />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    I accept the{' '}
                    <a href="#terms" onClick={e => e.preventDefault()} className="font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent hover:opacity-80">
                      Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a href="#privacy" onClick={e => e.preventDefault()} className="font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent hover:opacity-80">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                <FieldError className="text-red-400 mt-1.5 ml-8 text-xs">{errors.acceptTerms}</FieldError>
              </div>
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-[0.975rem] shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all mt-6 border-0 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:rounded-xl overflow-hidden"
            >
              {isLoading ? (
                <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </Form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Already a member?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button
            variant="outline"
            onClick={(e) => { e.preventDefault(); if (onSignIn) onSignIn(); }}
            className="w-full h-12 rounded-xl border-white/10 bg-transparent hover:bg-pink-500/10 hover:border-pink-500/40 hover:text-pink-300 text-zinc-300 font-medium transition-all"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

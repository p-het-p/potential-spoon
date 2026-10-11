import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/control-ui/ui/card';
import { Button } from '@/components/control-ui/ui/button';
import { Input } from '@/components/control-ui/ui/input';
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/control-ui/ui/field';
import { Checkbox } from '@/components/control-ui/ui/checkbox';
import { Form } from '@/components/control-ui/ui/form';
import { InputGroup, InputGroupAddon } from '@/components/control-ui/ui/input-group';
import './AuthForm.css';

/* ── SVG icon helpers ── */
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default function AuthForm({ onRegister, onForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="auth-page bg-gray-950 dark text-foreground min-h-screen flex items-center justify-center relative overflow-hidden p-6 font-sans">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <Card className="w-full max-w-[440px] relative z-10 bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl rounded-[24px] p-2 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30 mb-6">
            <IconShield />
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight mb-2">Welcome back</CardTitle>
          <CardDescription className="text-center text-zinc-400">Sign in to your account to continue</CardDescription>
        </CardHeader>
        
        <CardContent>
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <span>&#10003;</span> {successMsg}
            </div>
          )}

          <Form onSubmit={handleSignIn} className="space-y-5" noValidate>
            <Field invalid={!!errors.email}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Email address</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconMail />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                  </InputGroup>
                )}
              />
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.email}</FieldError>
            </Field>

            <Field invalid={!!errors.password}>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">Password</FieldLabel>
              <FieldControl
                render={({ className, ...props }) => (
                  <InputGroup className="bg-white/5 border-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 rounded-xl transition-all">
                    <InputGroupAddon className="pl-3.5 pr-2 text-zinc-400">
                      <IconLock />
                    </InputGroupAddon>
                    <Input
                      {...props}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="bg-transparent border-0 focus:ring-0 px-2 h-11 text-[0.95rem] placeholder:text-zinc-600"
                    />
                    <InputGroupAddon className="pr-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 rounded-md transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              <FieldError className="text-red-400 mt-1.5 text-xs">{errors.password}</FieldError>
            </Field>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox 
                  checked={rememberMe} 
                  onCheckedChange={setRememberMe} 
                  className="size-5 rounded-md border-2 border-white/20 bg-white/5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 transition-colors" 
                />
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
              </label>

              <a
                href="#forgot"
                onClick={handleForgotPassword}
                className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-[0.975rem] shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all mt-6 border-0 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:rounded-xl overflow-hidden"
            >
              {isLoading ? (
                <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button
            variant="outline"
            onClick={handleCreateAccount}
            className="w-full h-12 rounded-xl border-white/10 bg-transparent hover:bg-violet-500/10 hover:border-violet-500/40 hover:text-violet-300 text-zinc-300 font-medium transition-all"
          >
            Create Account
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <a
              href="#register"
              onClick={handleCreateAccount}
              className="font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

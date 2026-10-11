import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { login as loginApi } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)] px-4">
      <div className="w-full max-w-[440px] bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-sm p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]"></div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-ink)]">Campus Collective</span>
          </Link>
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-[var(--color-ink)] mb-2">Welcome back</h1>
          <p className="text-[14px] text-[var(--color-muted)]">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-[var(--color-error)] text-[14px] rounded-[var(--radius-md)] border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">Email address</label>
            <Input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[14px] font-semibold text-[var(--color-ink)]">Password</label>
            </div>
            <Input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-[14px] text-[var(--color-muted)] mt-8">
          Don't have an account? <Link to="/register" className="text-[var(--color-ink)] font-semibold">Sign up</Link>
        </p>
        <p className="text-center text-[14px] text-[var(--color-muted)] mt-3">
          <Link to="/guest" className="text-[var(--color-brand-accent)] font-medium">Continue as guest →</Link>
        </p>
      </div>
    </div>
  );
}

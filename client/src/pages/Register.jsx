import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { register as registerApi } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerApi(formData);
      if (data.token) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)] px-4 py-8">
      <div className="w-full max-w-[440px] bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-sm p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]"></div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-ink)]">Campus Collective</span>
          </Link>
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-[var(--color-ink)] mb-2">Create an account</h1>
          <p className="text-[14px] text-[var(--color-muted)]">Get started for free</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-[var(--color-error)] text-[14px] rounded-[var(--radius-md)] border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">Full Name</label>
            <Input name="full_name" type="text" value={formData.full_name} onChange={handleChange} placeholder="Jane Doe" required />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">Email address</label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">Phone</label>
            <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">Password</label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-[14px] text-[var(--color-muted)] mt-8">
          Already have an account? <Link to="/login" className="text-[var(--color-ink)] font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

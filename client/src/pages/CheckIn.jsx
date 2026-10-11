import { useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { checkInTicket } from '../lib/api';
import { useAuth } from '../lib/auth';

export function CheckIn() {
  const { token } = useAuth();
  const [qrToken, setQrToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await checkInTicket(token, qrToken);
      setResult(data);
      setQrToken('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />
      <main className="flex-1 py-[48px] px-6">
        <div className="max-w-[500px] mx-auto">
          <h1 className="text-[36px] font-semibold tracking-[-1px] text-[var(--color-ink)] mb-2 text-center">Ticket Check-In</h1>
          <p className="text-[14px] text-[var(--color-muted)] text-center mb-8">Scan or enter a QR token to check in an attendee.</p>

          <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-6">
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-[var(--color-ink)] mb-2">QR Token</label>
                <Input
                  type="text"
                  value={qrToken}
                  onChange={e => setQrToken(e.target.value)}
                  placeholder="Paste or scan QR token..."
                  required
                  className="font-mono"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading || !qrToken.trim()}>
                {loading ? 'Checking in...' : 'Check In'}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-[var(--color-error)] text-[14px] rounded-[var(--radius-md)] border border-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-4 p-4 bg-[var(--color-success)]/10 rounded-[var(--radius-md)] border border-[var(--color-success)]/20">
                <div className="text-[16px] font-semibold text-[var(--color-success)] mb-2">✓ Checked In</div>
                <div className="text-[14px] text-[var(--color-body)] space-y-1">
                  <p><strong>Ticket:</strong> #{result.ticket_number}</p>
                  <p><strong>Event:</strong> {result.event_title}</p>
                  {result.attendee_name && <p><strong>Attendee:</strong> {result.attendee_name}</p>}
                  <p><strong>Time:</strong> {new Date(result.checked_in_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

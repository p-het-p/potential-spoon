import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Ticket,
  Calendar,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getOrders, getOrderById, getOrderTickets } from '../lib/api';
import { useAuth } from '../lib/auth';
import { TicketPassCard } from '../components/tickets/TicketPassCard';

export function Orders() {
  const { token, isGuest, attendee, attendeeId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token && !isGuest) {
      setLoading(false);
      return;
    }

    getOrders(token)
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token, isGuest]);

  const statusColor = (s) =>
    ({
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    }[s] || 'bg-zinc-100 text-zinc-800 border-zinc-200');

  if (!token && !isGuest) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center bg-white border border-[var(--color-hairline)] rounded-[28px] p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[var(--color-ink)] mb-2">View Your Orders</h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Sign in or enter your attendee details to view your purchased tickets.
            </p>
            <div className="space-y-3">
              <Link to="/guest" className="block">
                <Button variant="primary" className="w-full h-11 text-sm font-semibold">
                  Attendee Portal & Passes
                </Button>
              </Link>
              <Link to="/login" className="block">
                <Button variant="secondary" className="w-full h-11 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
                {isGuest ? 'Your Attendee Orders' : 'Your Orders'}
              </h1>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {isGuest
                  ? `Orders & tickets issued to attendee_id #${attendeeId} (${attendee?.email || ''})`
                  : 'Track your event registrations and purchases.'}
              </p>
            </div>

            {isGuest && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Guest Attendee PK: #{attendeeId}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[var(--color-canvas)] rounded-2xl p-6 border border-[var(--color-hairline)] animate-pulse h-24" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[28px] p-12 text-center shadow-sm">
              <div className="size-16 rounded-full bg-[var(--color-surface-soft)] grid place-items-center mx-auto mb-4 text-[var(--color-muted)]">
                <Ticket size={28} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2">No orders found</h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                You haven't purchased any tickets or merchandise yet.
              </p>
              <Link to="/events">
                <Button variant="primary" className="h-10 px-5 text-sm font-semibold">
                  Browse Upcoming Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.order_id} to={`/orders/${order.order_id}`} className="block group">
                  <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[20px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group-hover:border-[var(--color-brand-accent)] transition-colors">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-lg font-bold text-[var(--color-ink)]">
                          Order #{order.order_id}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-muted)] flex items-center gap-2">
                        <Calendar size={13} />
                        <span>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--color-hairline)]">
                      <div className="text-right">
                        <span className="text-xs text-[var(--color-muted)] block">Total Paid</span>
                        <span className="text-xl font-extrabold text-[var(--color-ink)]">
                          ₹{Number(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                      <Button variant="secondary" className="h-9 text-xs font-bold px-4">
                        View Tickets →
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function OrderDetail() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { token, isGuest, attendee, attendeeId } = useAuth();
  const [order, setOrder] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token && !isGuest) {
      setLoading(false);
      return;
    }

    Promise.all([
      getOrderById(token, orderId),
      getOrderTickets(token, orderId).catch(() => ({ tickets: [] }))
    ])
      .then(([o, t]) => {
        setOrder(o);
        setTickets(t.tickets || []);
      })
      .finally(() => setLoading(false));
  }, [token, isGuest, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-[var(--color-muted)] flex items-center gap-2 text-sm font-semibold">
            <span className="size-4 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            <span>Loading order confirmation...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center bg-white border border-[var(--color-hairline)] rounded-[28px] p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[var(--color-ink)] mb-2">Order Not Found</h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Unable to locate this order or you may need to verify your attendee session.
            </p>
            <Link to="/events">
              <Button variant="primary">Browse Events</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const effectiveAttendeeName = attendee?.full_name || state?.attendeeName || 'Guest Attendee';
  const effectiveAttendeeId = attendeeId || state?.attendeeId || null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back link */}
          <div className="flex items-center justify-between">
            <Link
              to="/orders"
              className="text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-1"
            >
              ← Back to Orders
            </Link>

            {isGuest && (
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Attendee PK: attendee_id #{effectiveAttendeeId || 'active'}
              </span>
            )}
          </div>

          {/* Success Banner (Canvas Ticket Purchased / Confirmation) */}
          <div className="rounded-[24px] border-2 border-emerald-300 bg-emerald-50/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-emerald-600 text-white grid place-items-center shrink-0">
                <CheckCircle size={24} />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 block mb-1">
                  Ticket Purchased & Confirmed
                </span>
                <h1 className="text-2xl font-extrabold text-emerald-950">
                  {state?.paymentMessage || 'Your event ticket order has been confirmed!'}
                </h1>
                <p className="mt-1 text-xs text-emerald-800">
                  The event gate entrance scanner will verify your digital QR pass below.
                </p>
              </div>
            </div>

            <div className="text-right sm:self-center shrink-0">
              <span className="text-xs text-emerald-800 block font-medium">Order Number</span>
              <span className="font-mono text-xl font-black text-emerald-950">
                #{order.order_id}
              </span>
            </div>
          </div>

          {/* ── DIGITAL ENTRANCE TICKETS (Gate Check-In Ready) ── */}
          {tickets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--color-ink)] flex items-center gap-2">
                    <Ticket className="text-[var(--color-brand-accent)]" size={20} />
                    <span>Your Digital Entrance {tickets.length > 1 ? 'Tickets' : 'Ticket'}</span>
                  </h2>
                  <p className="text-xs text-[var(--color-muted)]">
                    Present the QR pass below at the door for entry check-in.
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--color-brand-accent)] bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                  {tickets.length} {tickets.length === 1 ? 'Pass' : 'Passes'} Issued
                </span>
              </div>

              <div className="grid gap-6">
                {tickets.map((ticket) => (
                  <TicketPassCard
                    key={ticket.ticket_id}
                    ticket={ticket}
                    attendeeName={effectiveAttendeeName}
                    attendeeId={effectiveAttendeeId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Order Summary & Items breakdown */}
          <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[24px] shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[var(--color-ink)] border-b border-[var(--color-hairline)] pb-4">
              Order Receipt
            </h2>

            <div className="divide-y divide-[var(--color-hairline)]">
              {order.items?.map((item) => (
                <div key={item.order_item_id} className="py-4 flex justify-between items-center text-sm">
                  <div>
                    <h3 className="font-bold text-[var(--color-ink)]">{item.product_name}</h3>
                    <p className="text-xs text-[var(--color-muted)]">
                      Quantity: {item.quantity} × ₹{item.unit_price}
                    </p>
                  </div>
                  <div className="font-extrabold text-[var(--color-ink)] text-base">
                    ₹{Number(item.total_price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[var(--color-hairline)] pt-4 flex justify-between items-center">
              <div>
                <span className="text-base font-bold text-[var(--color-ink)] block">Total Paid</span>
                <span className="text-xs text-[var(--color-muted)]">
                  Payment Status: <strong className="text-emerald-700 capitalize">{order.status}</strong>
                </span>
              </div>
              <span className="text-2xl font-black text-[var(--color-ink)]">
                ₹{Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* ── Path B Promotion: Join the Club ── */}
          <div className="rounded-[24px] border-2 border-violet-200 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-indigo-50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-200/60 text-violet-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-violet-700" />
                <span>Next Step: Join the Club (Path B)</span>
              </div>
              <h3 className="text-xl font-bold text-violet-950">
                Turn your guest experience into full membership!
              </h3>
              <p className="text-xs text-violet-900 mt-1 max-w-lg leading-relaxed">
                Members unlock discounted event tickets, exclusive merchandise pricing, club voting rights, and access to the student dashboard.
              </p>
            </div>

            <Link to="/memberships" className="shrink-0">
              <Button variant="solid" className="bg-violet-900 text-white hover:bg-violet-800 text-xs font-bold h-11 px-5">
                View Membership Plans →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, ArrowRight, CheckCircle, CreditCard, Ticket, Trash2 } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getCart, updateCartItem, removeCartItem, checkout as doCheckout } from '../lib/api';
import { useAuth } from '../lib/auth';
import { AttendeeModal } from '../components/guest/AttendeeModal';

export function Cart() {
  const { token, isGuest, attendee, attendeeId } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);

  const fetchCart = () => {
    if (!token && !isGuest) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getCart(token)
      .then((data) => setCart(data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, [token, isGuest]);

  const handleQuantity = async (itemId, qty) => {
    try {
      if (qty <= 0) {
        await removeCartItem(token, itemId);
      } else {
        await updateCartItem(token, itemId, qty);
      }
      fetchCart();
    } catch (err) {
      setError(err.message || 'Could not update item quantity');
    }
  };

  const handleCheckout = async () => {
    setChecking(true);
    setError(null);
    try {
      const result = await doCheckout(token, paymentMethod);
      navigate(`/orders/${result.order_id}`, {
        state: {
          paymentMessage: result.message,
          isGuestOrder: isGuest,
          attendeeId: attendeeId,
          attendeeName: attendee?.full_name,
        },
      });
    } catch (err) {
      setError(err.message || 'Checkout could not be completed');
    } finally {
      setChecking(false);
    }
  };

  // State when not signed in and not a guest
  if (!token && !isGuest) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center bg-white border border-[var(--color-hairline)] rounded-[28px] p-8 shadow-sm">
            <div className="size-16 rounded-full bg-zinc-100 grid place-items-center mx-auto mb-4 text-[var(--color-ink)]">
              <ShoppingBag size={28} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)] mb-2">
              Cart Access
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Sign in to your member account or continue as a guest attendee to view and checkout your tickets.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => setIsAttendeeModalOpen(true)}
                className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Continue as Guest Attendee</span>
              </Button>

              <Link to="/login" className="block">
                <Button variant="secondary" className="w-full h-11 text-sm font-semibold">
                  Sign in with Member Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />

        <AttendeeModal
          isOpen={isAttendeeModalOpen}
          onClose={() => setIsAttendeeModalOpen(false)}
          onVerified={() => fetchCart()}
        />
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
                Your Cart
              </h1>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Review your ticket reservations and complete payment.
              </p>
            </div>

            {isGuest && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>
                  Attendee PK: <strong>attendee_id #{attendeeId}</strong> ({attendee?.full_name?.split(' ')[0] || 'Guest'})
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-2xl border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-[var(--color-canvas)] rounded-[24px] p-8 border border-[var(--color-hairline)] animate-pulse h-48" />
          ) : items.length === 0 ? (
            <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[28px] p-12 text-center shadow-sm">
              <div className="size-16 rounded-full bg-[var(--color-surface-soft)] grid place-items-center mx-auto mb-4 text-[var(--color-muted)]">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2">Your cart is empty</h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                Browse our upcoming campus events to select non-member tickets.
              </p>
              <Link to="/events">
                <Button variant="primary" className="h-10 px-5 text-sm font-semibold">
                  Browse Events & Tickets
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items List */}
              <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[24px] shadow-sm overflow-hidden divide-y divide-[var(--color-hairline)]">
                {items.map((item) => (
                  <div key={item.cart_item_id} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1 rounded bg-[var(--color-surface-soft)] text-[var(--color-brand-accent)]">
                          <Ticket size={14} />
                        </span>
                        <h3 className="text-base font-bold text-[var(--color-ink)] truncate">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--color-muted)]">
                        ₹{item.unit_price} each · Item ID: #{item.product_id}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[var(--color-hairline)] rounded-xl overflow-hidden bg-[var(--color-surface-soft)]">
                        <button
                          className="size-8 flex items-center justify-center text-[var(--color-ink)] hover:bg-zinc-200 text-sm font-bold cursor-pointer"
                          onClick={() => handleQuantity(item.cart_item_id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          className="size-8 flex items-center justify-center text-[var(--color-ink)] hover:bg-zinc-200 text-sm font-bold cursor-pointer"
                          onClick={() => handleQuantity(item.cart_item_id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="w-24 text-right">
                        <span className="text-base font-extrabold text-[var(--color-ink)]">
                          ₹{(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout / Payment Method Card */}
              <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[24px] shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-baseline border-b border-[var(--color-hairline)] pb-5">
                  <span className="text-base font-bold text-[var(--color-ink)]">Subtotal</span>
                  <span className="text-3xl font-extrabold text-[var(--color-ink)]">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 text-sm font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="cash">Cash (Pay at Door / Entrance Table)</option>
                    <option value="upi">UPI (Instant Verification)</option>
                    <option value="card">Card (Debit / Credit)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="rounded-xl bg-[var(--color-surface-soft)] p-4 border border-[var(--color-hairline)] text-xs text-[var(--color-muted)] leading-relaxed">
                  <p>
                    ✓ <strong>Seat Capacity:</strong> Completing checkout immediately reserves your seat and generates an authentic QR entrance pass linked to your Attendee ID.
                  </p>
                </div>

                <Button
                  variant="primary"
                  className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={checking}
                >
                  {checking ? (
                    'Processing Ticket Order...'
                  ) : (
                    <>
                      <span>Pay ₹{totalAmount.toFixed(2)} & Confirm Ticket</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

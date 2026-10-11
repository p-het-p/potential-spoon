import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Ticket,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getEventById, getProducts, addToCart } from '../lib/api';
import { useAuth } from '../lib/auth';
import { AttendeeModal } from '../components/guest/AttendeeModal';

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isGuest, attendee, attendeeId } = useAuth();
  const [event, setEvent] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('all'); // 'all' | 'guest' | 'member'

  useEffect(() => {
    Promise.all([
      getEventById(id),
      getProducts({ event_id: id }).catch(() => ({ products: [] }))
    ])
      .then(([ev, prod]) => {
        setEvent(ev);
        setProducts(prod.products || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTicketSelect = async (productId, directCheckout = false) => {
    // If not authenticated and not a verified guest attendee, prompt attendee details
    if (!token && !isGuest) {
      setPendingProductId(productId);
      setIsAttendeeModalOpen(true);
      return;
    }

    setAddingId(productId);
    setMessage(null);
    try {
      await addToCart(token, productId, 1);
      if (directCheckout) {
        navigate('/cart');
      } else {
        setMessageType('success');
        setMessage('Ticket added to your cart! You can review your cart or checkout now.');
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Could not add ticket to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleAttendeeVerified = async (newAttendee) => {
    setIsAttendeeModalOpen(false);
    if (pendingProductId) {
      setAddingId(pendingProductId);
      try {
        await addToCart(token, pendingProductId, 1);
        setMessageType('success');
        setMessage(`Ticket reserved for Attendee ID #${newAttendee.attendee_id}! You can now complete your purchase.`);
      } catch (err) {
        setMessageType('error');
        setMessage(err.message || 'Ticket could not be added to cart');
      } finally {
        setAddingId(null);
        setPendingProductId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="text-[var(--color-muted)] flex items-center gap-2">
            <span className="size-4 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            <span>Loading event details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
        <TopNav />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-4">Event not found</h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">The event you are looking for may have been archived or removed.</p>
            <Link to="/events">
              <Button variant="primary">Back to Events</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate ticket availability and seat capacity
  const isPublic = event.is_public !== false;
  const totalCapacity = event.capacity || null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
      <TopNav />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-8 font-medium">
            <Link to="/" className="hover:text-[var(--color-ink)]">Home</Link>
            <span>/</span>
            <Link to="/events" className="hover:text-[var(--color-ink)]">Events</Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold truncate max-w-xs">{event.title}</span>
          </div>

          {/* Alert Message Banner */}
          {message && (
            <div
              role="alert"
              className={`mb-6 p-4 rounded-2xl border text-sm font-medium flex items-center justify-between gap-4 animate-in fade-in ${
                messageType === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {messageType === 'success' ? (
                  <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-red-600 shrink-0" />
                )}
                <span>{message}</span>
              </div>
              {messageType === 'success' && (
                <Link to="/cart">
                  <Button variant="primary" className="h-8 text-xs px-3">
                    Go to Cart →
                  </Button>
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── Left Column: Event Information (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100">
                  {new Date(event.starts_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                {isPublic && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Open to Non-Members</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-ink)] leading-tight">
                {event.title}
              </h1>

              <div className="prose text-base text-[var(--color-body)] leading-relaxed whitespace-pre-wrap">
                {event.description || 'Details for this campus gathering will be published soon.'}
              </div>

              {/* Event Specs Card */}
              <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.venue && (
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-white border border-[var(--color-hairline)] grid place-items-center text-[var(--color-brand-accent)] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--color-muted)] font-bold uppercase tracking-wider block">Venue</span>
                      <span className="text-sm font-bold text-[var(--color-ink)]">{event.venue}</span>
                    </div>
                  </div>
                )}

                {totalCapacity && (
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-white border border-[var(--color-hairline)] grid place-items-center text-[var(--color-brand-accent)] shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--color-muted)] font-bold uppercase tracking-wider block">Seat Capacity</span>
                      <span className="text-sm font-bold text-[var(--color-ink)]">
                        {totalCapacity} Places (Cap enforced)
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-white border border-[var(--color-hairline)] grid place-items-center text-[var(--color-brand-accent)] shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-muted)] font-bold uppercase tracking-wider block">Start Time</span>
                    <span className="text-sm font-bold text-[var(--color-ink)]">
                      {new Date(event.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {event.ends_at && (
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-white border border-[var(--color-hairline)] grid place-items-center text-[var(--color-brand-accent)] shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--color-muted)] font-bold uppercase tracking-wider block">Conclusion</span>
                      <span className="text-sm font-bold text-[var(--color-ink)]">
                        {new Date(event.ends_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Path B Conversion Box */}
              <div className="rounded-2xl border border-violet-200/80 bg-violet-50/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-800">
                    <Sparkles size={14} />
                    <span>Want Member Perks? (Path B)</span>
                  </div>
                  <p className="mt-1 text-sm text-violet-950 font-medium">
                    Members get discounted tickets to all events and full dashboard access.
                  </p>
                </div>
                <Link to="/memberships" className="shrink-0">
                  <Button variant="secondary" className="bg-white text-xs font-bold border-violet-200 text-violet-900 hover:bg-violet-100">
                    Join the Club
                  </Button>
                </Link>
              </div>
            </div>

            {/* ── Right Column: Ticket Booking & Attendee Workflow (5 cols) ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Attendee Status Card if verified */}
              {isGuest && (
                <div className="rounded-2xl border-2 border-emerald-400/80 bg-emerald-50/70 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      <span>Verified Guest Attendee</span>
                    </span>
                    <span className="font-mono text-xs font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                      attendee_id: #{attendeeId}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-emerald-950">
                    {attendee?.full_name || 'Guest'}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {attendee?.email || ''}
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-medium">Ready to reserve non-member tickets</span>
                    <Link to="/cart" className="font-bold underline text-emerald-900 hover:text-emerald-950">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}

              {/* Tickets Section — Trips Archetype (Hero Card + Secondary Vertical Stack) */}
              {(() => {
                const filteredProducts = products.filter((p) => {
                  if (ticketFilter === 'guest') return true;
                  if (ticketFilter === 'member') return p.member_price !== p.non_member_price;
                  return true;
                });
                const heroProduct = filteredProducts[0];
                const secondaryProducts = filteredProducts.slice(1);

                return (
                  <div className="rounded-[28px] border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                    {/* Header with Title and Segmented Control */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Event Tickets
                          </h2>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                            {products.length}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Select a pass to reserve your seat at this event.
                        </p>
                      </div>

                      {/* Segmented Control */}
                      <div className="inline-flex p-1 bg-zinc-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setTicketFilter('all')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            ticketFilter === 'all'
                              ? 'bg-white text-zinc-900 shadow-sm font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                        >
                          All Passes
                        </button>
                        <button
                          type="button"
                          onClick={() => setTicketFilter('guest')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            ticketFilter === 'guest'
                              ? 'bg-white text-zinc-900 shadow-sm font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                        >
                          Non-Member
                        </button>
                        <button
                          type="button"
                          onClick={() => setTicketFilter('member')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            ticketFilter === 'member'
                              ? 'bg-white text-zinc-900 shadow-sm font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                        >
                          Member Rates
                        </button>
                      </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-zinc-50 text-xs text-zinc-500 border border-dashed border-zinc-200">
                        No tickets matching this filter.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* ── 1. Hero Ticket Card ── */}
                        {heroProduct && (() => {
                          const isSoldOut = heroProduct.stock_quantity !== null && heroProduct.stock_quantity <= 0;
                          const hasDiscount = heroProduct.member_price !== heroProduct.non_member_price;
                          const discountAmount = hasDiscount ? heroProduct.non_member_price - heroProduct.member_price : 0;

                          return (
                            <div className={`rounded-2xl border p-6 transition-all shadow-sm ${
                              isSoldOut
                                ? 'border-zinc-200 bg-zinc-50 opacity-60'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}>
                              {/* Status Pills */}
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 text-white">
                                    Featured Pass
                                  </span>
                                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                    Non-Member Option
                                  </span>
                                </div>

                                {heroProduct.stock_quantity !== null ? (
                                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                                    isSoldOut
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : 'bg-zinc-100 text-zinc-700'
                                  }`}>
                                    {isSoldOut ? 'Capacity Full' : `${heroProduct.stock_quantity} Left`}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600">
                                    Open Seating
                                  </span>
                                )}
                              </div>

                              {/* Title & Price */}
                              <div className="mb-4">
                                <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                                  {heroProduct.name}
                                </h3>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-3xl font-extrabold text-zinc-900">
                                    ₹{heroProduct.non_member_price}
                                  </span>
                                  <span className="text-xs text-zinc-500">Non-Member Rate</span>
                                </div>
                              </div>

                              {/* Member Rate Pill */}
                              {hasDiscount && (
                                <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-800 border border-violet-100 text-xs">
                                  <span>Club Member Rate: <strong>₹{heroProduct.member_price}</strong></span>
                                  <span className="text-[11px] text-violet-600 font-semibold">
                                    (Save ₹{discountAmount})
                                  </span>
                                </div>
                              )}

                              {/* Action CTAs */}
                              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                                <button
                                  type="button"
                                  disabled={isSoldOut || addingId === heroProduct.product_id}
                                  onClick={() => handleTicketSelect(heroProduct.product_id, false)}
                                  className="w-full sm:flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                >
                                  <Ticket size={15} />
                                  <span>
                                    {addingId === heroProduct.product_id
                                      ? 'Reserving...'
                                      : isGuest
                                      ? 'Get Non-Member Pass'
                                      : 'Choose Non-Member Pass'}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isSoldOut || addingId === heroProduct.product_id}
                                  onClick={() => handleTicketSelect(heroProduct.product_id, true)}
                                  className="w-full sm:w-auto h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  Pay Now →
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── 2. Secondary Vertical Stack ── */}
                        {secondaryProducts.length > 0 && (
                          <div className="pt-2 space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 px-1">
                              Additional Options ({secondaryProducts.length})
                            </p>
                            {secondaryProducts.map((product) => {
                              const isSoldOut = product.stock_quantity !== null && product.stock_quantity <= 0;
                              return (
                                <div
                                  key={product.product_id}
                                  className={`rounded-xl border p-4 bg-white shadow-sm flex items-center justify-between gap-4 transition-all hover:border-zinc-300 ${
                                    isSoldOut ? 'border-zinc-200 bg-zinc-50 opacity-60' : 'border-zinc-200'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <h4 className="text-sm font-bold text-zinc-900 truncate">
                                        {product.name}
                                      </h4>
                                      {product.stock_quantity !== null && (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                          {isSoldOut ? 'Sold out' : `${product.stock_quantity} left`}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                      <span className="font-bold text-zinc-900">₹{product.non_member_price}</span>
                                      {product.member_price !== product.non_member_price && (
                                        <span className="text-violet-700 font-medium">Member: ₹{product.member_price}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      disabled={isSoldOut || addingId === product.product_id}
                                      onClick={() => handleTicketSelect(product.product_id, false)}
                                      className="h-9 px-3.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {addingId === product.product_id ? '...' : 'Select'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footnote about Guest Workflow */}
                    <div className="mt-5 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
                      {!isGuest && !token ? (
                        <p>
                          No account needed. Selecting a pass prompts your attendee details & OTP.
                        </p>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Link to="/cart" className="font-bold text-zinc-900 hover:underline flex items-center gap-1">
                            <ShoppingBag size={13} /> View Cart
                          </Link>
                          <span>·</span>
                          <Link to="/guest" className="font-bold text-zinc-900 hover:underline">
                            Attendee Portal
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Attendee Registration & OTP Verification Modal */}
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        initialEvent={event}
        onVerified={handleAttendeeVerified}
      />
    </div>
  );
}

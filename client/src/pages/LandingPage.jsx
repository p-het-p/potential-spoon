import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  TicketCheck,
  ShoppingBag,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  Bell,
  MapPin,
  CheckCircle2,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getEvents } from '../lib/api';
import { useAuth } from '../lib/auth';
import { AttendeeModal } from '../components/guest/AttendeeModal';

export function LandingPage() {
  const { isGuest, attendee, attendeeId } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);

  useEffect(() => {
    getEvents({ limit: 3 })
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  const openGuestFlow = (eventItem = null) => {
    setSelectedEventForModal(eventItem);
    setIsAttendeeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col">
      <TopNav />

      <main className="flex-1">
        {/* Guest Active Banner if in Guest Mode */}
        {isGuest && (
          <div className="bg-emerald-50 border-b border-emerald-200/80 px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Browsing as <strong>Guest Attendee</strong>: {attendee?.full_name || 'Guest'} ({attendee?.email || ''}) — Attendee ID: #{attendeeId || 'active'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/guest" className="font-bold underline hover:text-emerald-950">
                  Attendee Portal & Pass
                </Link>
                <Link to="/cart" className="font-bold underline hover:text-emerald-950">
                  Guest Cart
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── 1. Hero Section ── */}
        <section className="relative isolate overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-strong)] text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles size={14} />
                <span>Public Student Organization Hub</span>
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-[var(--color-ink)] sm:text-7xl">
                Campus life, gathered in one place.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--color-body)]">
                Campus Collective is open to everyone. Whether you want to attend upcoming events as a guest, join as a full member, or explore freely — no account is required to start.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/events">
                  <Button variant="primary" className="h-11 px-5 text-sm font-semibold">
                    Explore Events
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  onClick={() => openGuestFlow(null)}
                  className="h-11 px-5 text-sm font-semibold flex items-center gap-2"
                >
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>{isGuest ? 'Attendee Verified' : 'Attend as Guest'}</span>
                </Button>

                <Link to="/memberships">
                  <Button variant="text" className="h-11 text-sm font-semibold text-[var(--color-ink)]">
                    Membership Plans →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Quick Preview Card */}
            <div className="relative rounded-[28px] bg-[var(--color-surface-dark)] p-3 shadow-2xl">
              <div className="rounded-[18px] bg-[#1a1a1a] p-6 text-white border border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Visitor Quick Action</span>
                  <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                    Open To Non-Members
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/10 p-4 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Non-Member Workflow</p>
                    <p className="mt-1 text-lg font-bold">1. Pick event · 2. Enter attendee info · 3. Digital QR pass</p>
                    <p className="mt-2 text-xs text-zinc-400">Respects live seat capacity with instant gate verification.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-zinc-400 block mb-1">Gate Check-in</span>
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <QrCode size={14} className="text-emerald-400" /> Instant QR Token
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-zinc-400 block mb-1">Attendee ID</span>
                      <span className="font-bold text-white font-mono">
                        PK: attendee_id
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openGuestFlow(null)}
                    className="w-full flex items-center justify-between rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <span>Start Guest Attendee Pass</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. What Does the Visitor Want to Do? (Nodes A, B, C) ── */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-brand-accent)]">
              Choose an Action
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              What would you like to do today?
            </h2>
            <p className="mt-3 text-base text-[var(--color-muted)]">
              As a visitor, you have complete flexibility to participate at your own pace.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Option A: Attend an Event */}
            <div className="rounded-[24px] border-2 border-emerald-500/40 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                Guest Path A
              </div>

              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 mb-6">
                <TicketCheck size={24} />
              </div>

              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                A. Attend an Event
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                Browse campus events, select the non-member ticket, register your attendee details, pay, and receive your digital QR entrance pass.
              </p>

              <div className="mt-5 space-y-2 border-t border-[var(--color-hairline)] pt-4 text-xs text-[var(--color-body)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Respects live seat capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Uses Attendee ID primary key</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Instant email OTP verification</span>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Link to="/events" className="block">
                  <Button variant="primary" className="w-full text-xs font-bold h-10">
                    Browse Events & Tickets →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Option B: Join the Club */}
            <div className="rounded-[24px] border border-[var(--color-hairline)] bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="grid size-12 place-items-center rounded-2xl bg-violet-50 text-violet-700 mb-6">
                <Users size={24} />
              </div>

              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                B. Join the Club
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                Create a student account, select your membership plan, pay annual dues, and unlock the member dashboard with discounted pricing.
              </p>

              <div className="mt-5 space-y-2 border-t border-[var(--color-hairline)] pt-4 text-xs text-[var(--color-body)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                  <span>Exclusive member event pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                  <span>Complete order history & profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                  <span>Member dashboard privileges</span>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Link to="/memberships" className="block">
                  <Button variant="secondary" className="w-full text-xs font-bold h-10">
                    View Membership Plans →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Option C: Explore Only */}
            <div className="rounded-[24px] border border-[var(--color-hairline)] bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-700 mb-6">
                <CalendarDays size={24} />
              </div>

              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                C. Explore Only
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                Stay as a visitor. Read public announcements, check club details, and browse upcoming schedules without signing up or logging in.
              </p>

              <div className="mt-5 space-y-2 border-t border-[var(--color-hairline)] pt-4 text-xs text-[var(--color-body)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                  <span>Zero sign-in or account friction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                  <span>Public notices and club updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                  <span>Always free to continue browsing</span>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <a href="#announcements" className="block">
                  <Button variant="secondary" className="w-full text-xs font-bold h-10">
                    Read Public Announcements ↓
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Upcoming Events & Seat Capacity Preview ── */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-b border-[var(--color-hairline)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-brand-accent)]">
                Upcoming Gatherings
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
                Events with Non-Member Tickets
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Real-time seat capacities and non-member ticket options.
              </p>
            </div>

            <Link to="/events">
              <Button variant="secondary" className="text-xs font-bold">
                View All Events →
              </Button>
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-[var(--color-surface-card)] animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-hairline)] p-12 text-center text-sm text-[var(--color-muted)]">
              No upcoming events found at this moment. Check back soon!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[20px] border border-[var(--color-hairline)] bg-white p-6 shadow-sm flex flex-col hover:border-[var(--color-brand-accent)] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--color-brand-accent)] uppercase tracking-wider mb-3">
                    <span>
                      {new Date(event.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                      Public Event
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-4 leading-relaxed">
                    {event.description || 'Details will be announced soon.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-[var(--color-body)] mb-6">
                    {event.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[var(--color-brand-accent)]" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    {event.capacity && (
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-[var(--color-brand-accent)]" />
                        <span className="font-semibold text-[var(--color-ink)]">
                          {event.capacity} total seats (Capacity enforced)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between gap-3">
                    <Link to={`/events/${event.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full text-xs font-bold h-9">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() => openGuestFlow(event)}
                      className="text-xs font-bold h-9 px-3"
                    >
                      Buy Ticket
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Public Announcements (Node 2) ── */}
        <section id="announcements" className="mx-auto max-w-6xl px-6 py-20 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Bell size={13} />
              <span>Public Announcements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              Club Notices & Visitor Updates
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              All public notices are published here for members and visiting attendees alike.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-[var(--color-hairline)] bg-white p-6 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Guest Guidance</span>
              <h3 className="mt-2 text-base font-bold text-[var(--color-ink)]">How Digital QR Passes Work</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                When you purchase a non-member ticket, a secure cryptographic QR pass is created and linked to your attendee ID. Present it at the door for instant check-in.
              </p>
            </article>

            <article className="rounded-2xl border border-[var(--color-hairline)] bg-white p-6 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Membership Notice</span>
              <h3 className="mt-2 text-base font-bold text-[var(--color-ink)]">Spring Dues & Benefits Open</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                Members receive discounted tickets across all upcoming campus performances and workshops, plus voting power on club initiatives.
              </p>
            </article>

            <article className="rounded-2xl border border-[var(--color-hairline)] bg-white p-6 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Event Policy</span>
              <h3 className="mt-2 text-base font-bold text-[var(--color-ink)]">Venue & Seating Capacities</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                To keep every event comfortable and safe, ticket issuance is hard-capped to each venue's designated capacity. Book non-member tickets in advance!
              </p>
            </article>
          </div>
        </section>

        {/* ── 5. Call To Action Footer Banner ── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-[28px] bg-[var(--color-primary)] px-7 py-12 text-white sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Join When You're Ready</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Become a full club member anytime.</h2>
              <p className="mt-2 text-sm text-zinc-300 max-w-lg">
                Attended an event as a guest and want to be part of the core crew? Create an account, activate your membership, and access member perks.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/register">
                <Button variant="solid" className="bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold">
                  Create Member Account
                </Button>
              </Link>
              <Link to="/guest">
                <Button variant="secondary" className="border-white/30 text-white hover:bg-white/10 text-sm font-bold">
                  Attendee Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Global Attendee Registration / OTP Modal */}
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        initialEvent={selectedEventForModal}
      />
    </div>
  );
}

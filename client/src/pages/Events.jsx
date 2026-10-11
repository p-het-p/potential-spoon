import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getEvents } from '../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/control-ui/ui/card';

const palettes = ['from-violet-700 via-indigo-700 to-sky-600', 'from-fuchsia-700 via-rose-600 to-orange-500', 'from-emerald-700 via-teal-600 to-cyan-500'];
const dateParts = (date) => ({ month: new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), day: new Date(date).getDate(), time: new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) });

export function Events() {
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true); const [page, setPage] = useState(1); const [total, setTotal] = useState(0); const limit = 9;
  useEffect(() => { setLoading(true); getEvents({ page, limit }).then((data) => { setEvents(data.events || []); setTotal(data.pagination?.total || 0); }).catch(() => setEvents([])).finally(() => setLoading(false)); }, [page]);
  return <div className="flex min-h-screen flex-col bg-[var(--color-canvas)]"><TopNav /><main className="flex-1"><section className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-6 py-16 sm:py-20"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--color-brand-accent)]">The campus calendar</p><div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h1 className="text-5xl font-semibold tracking-[-.055em] text-[var(--color-ink)] sm:text-6xl">Find your next <em className="font-serif font-normal">good</em> thing.</h1><p className="mt-4 max-w-xl text-lg leading-7 text-[var(--color-body)]">Talks, performances, workshops, and the small moments that turn a campus into a community.</p></div><div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-5 py-4 text-sm text-[var(--color-muted)]"><span className="tabular-nums text-2xl font-bold text-[var(--color-ink)]">{total}</span><span className="ml-2">upcoming events</span></div></div></div></section><section className="mx-auto w-full max-w-7xl px-6 py-12">{loading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-[360px] animate-pulse rounded-[24px] bg-[var(--color-surface-card)]" />)}</div> : events.length === 0 ? <EmptyEvents /> : <><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => <EventCard key={event.id} event={event} palette={palettes[index % palettes.length]} />)}</div>{total > limit && <div className="mt-12 flex items-center justify-center gap-3"><Button variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="tabular-nums px-3 text-sm text-[var(--color-muted)]">{page} / {Math.ceil(total / limit)}</span><Button variant="secondary" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage((value) => value + 1)}>Next</Button></div>}</>}</section></main><Footer /></div>;
}

function EventCard({ event, palette }) { 
  const date = dateParts(event.starts_at); 
  return (
    <Link to={`/events/${event.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-colors hover:border-[var(--color-brand-accent)]">
        <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${palette} p-5 text-white`}>
          <div className="absolute -right-5 -top-10 size-44 rounded-full border-[18px] border-white/15" />
          <div className="relative flex items-start justify-between">
            <div className="rounded-xl bg-white/15 px-3 py-2 text-center backdrop-blur">
              <div className="text-[10px] font-bold tracking-[.14em]">{date.month}</div>
              <div className="mt-0.5 text-2xl font-black leading-none tabular-nums">{date.day}</div>
            </div>
            <ArrowUpRight className="mt-1 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={21} />
          </div>
        </div>
        <CardHeader className="pt-5 pb-3">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[var(--color-brand-accent)] mb-1">{date.time}</p>
          <CardTitle render={<h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]" />}>{event.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)] mt-2">
            {event.description || 'Details will be announced soon.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto pt-3 pb-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[var(--color-body)]">
          {event.venue && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--color-brand-accent)]" />{event.venue}</span>}
          {event.capacity && <span className="flex items-center gap-1.5 tabular-nums"><Users size={14} className="text-[var(--color-brand-accent)]" />{event.capacity} places</span>}
        </CardContent>
      </Card>
    </Link>
  ); 
}
function EmptyEvents() { return <div className="rounded-[24px] border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-6 py-20 text-center"><CalendarDays className="mx-auto text-[var(--color-brand-accent)]" size={34} /><h2 className="mt-4 text-xl font-bold text-[var(--color-ink)]">The calendar is catching its breath.</h2><p className="mt-2 text-sm text-[var(--color-muted)]">Check back soon for the next gathering.</p></div>; }

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../lib/api';
import { useAuth } from '../lib/auth';

const blank = { title: '', description: '', venue: '', starts_at: '', ends_at: '', capacity: '', is_public: true };
const toApiDate = (value) => value ? new Date(value).toISOString() : undefined;

export function ManageEvents() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getEvents({ limit: 100 }, token).then((data) => setEvents(data.events || [])).catch((error) => setMessage(error.message));
  useEffect(() => { if (token) load(); }, [token]);
  if (!token || user?.role !== 'club_leader') return <Navigate to="/dashboard" replace />;

  const edit = (event) => {
    const local = (date) => date ? new Date(date).toISOString().slice(0, 16) : '';
    setEditingId(event.id);
    setForm({ ...event, starts_at: local(event.starts_at), ends_at: local(event.ends_at), capacity: String(event.capacity) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setMessage('');
    try {
      const payload = { ...form, capacity: Number(form.capacity), starts_at: toApiDate(form.starts_at), ends_at: toApiDate(form.ends_at) };
      if (!payload.ends_at) delete payload.ends_at;
      if (editingId) await updateEvent(token, editingId, payload);
      else await createEvent(token, payload);
      setForm(blank); setEditingId(null); setMessage(editingId ? 'Event updated.' : 'Event created.'); load();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try { await deleteEvent(token, id); setMessage('Event deleted.'); load(); }
    catch (error) { setMessage(error.message); }
  };

  const field = (name, label, type = 'text', required = false) => <label className="block"><span className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">{label}</span><Input type={type} required={required} value={form[name] ?? ''} onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))} /></label>;
  return <div className="min-h-screen bg-[var(--color-surface-soft)] text-[var(--color-body)]"><TopNav /><main className="mx-auto w-full max-w-6xl px-5 py-12"><div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[var(--color-brand-accent)]">Club leader tools</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-ink)]">Manage events</h1></div><p className="text-sm text-[var(--color-muted)]">Create, revise, or remove published events.</p></div>
    {message && <div role="status" className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-3 text-sm text-[var(--color-ink)]">{message}</div>}
    <section className="mb-10 rounded-[20px] border border-[var(--color-hairline)] bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold text-[var(--color-ink)]">{editingId ? 'Edit event' : 'New event'}</h2><form onSubmit={submit} className="grid gap-4 md:grid-cols-2">{field('title', 'Title', 'text', true)}{field('venue', 'Venue')}<label className="md:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">Description</span><textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className="min-h-28 w-full rounded-[var(--radius-md)] border border-[var(--color-hairline)] px-3 py-2 text-sm outline-none focus:border-[var(--color-ink)]" /></label>{field('starts_at', 'Starts', 'datetime-local', true)}{field('ends_at', 'Ends', 'datetime-local')}{field('capacity', 'Capacity', 'number', true)}<label className="flex items-end gap-2 pb-2 text-sm font-medium text-[var(--color-ink)]"><input type="checkbox" checked={form.is_public} onChange={(e) => setForm((current) => ({ ...current, is_public: e.target.checked }))} /> Public event</label><div className="md:col-span-2 flex gap-3"><Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}</Button>{editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</Button>}</div></form></section>
    <section className="overflow-hidden rounded-[20px] border border-[var(--color-hairline)] bg-white"><div className="border-b border-[var(--color-hairline)] px-6 py-4"><h2 className="font-semibold text-[var(--color-ink)]">All events</h2></div><div className="divide-y divide-[var(--color-hairline)]">{events.map((event) => <article key={event.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-[var(--color-ink)]">{event.title}</h3><p className="mt-1 text-sm text-[var(--color-muted)]">{new Date(event.starts_at).toLocaleString()} · {event.venue || 'Venue to be confirmed'} · <span className="tabular-nums">{event.capacity}</span> places</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => edit(event)}>Edit</Button><Button variant="text" className="text-red-600" onClick={() => remove(event.id)}>Delete</Button></div></article>)}{events.length === 0 && <p className="p-8 text-center text-sm text-[var(--color-muted)]">No events yet.</p>}</div></section>
  </main><Footer /></div>;
}

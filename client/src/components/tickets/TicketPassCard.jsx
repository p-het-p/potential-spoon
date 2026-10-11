import { Printer, CheckCircle, Calendar, MapPin, User, Hash } from 'lucide-react';
import { Button } from '../ui/Button';

export function TicketPassCard({ ticket, attendeeName, attendeeId }) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = ticket.issued_at
    ? new Date(ticket.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Valid for Event';

  return (
    <div className="relative rounded-[24px] border-2 border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-md overflow-hidden transition-all hover:shadow-lg">
      {/* Top Banner */}
      <div className="bg-[var(--color-surface-dark)] px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--color-primary)] text-xs font-black text-white">
            CC
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-300">
            Official Entrance Pass
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            ticket.status === 'active'
              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
              : 'bg-zinc-700 text-zinc-300'
          }`}
        >
          {ticket.status === 'active' && <CheckCircle size={12} />}
          {ticket.status === 'active' ? 'Gate Ready' : ticket.status}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Event & Attendee Details (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-accent)] mb-1">
              Event
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              {ticket.event_title || 'Campus Event'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--color-muted)] font-medium flex items-center gap-1 mb-1">
                <Hash size={12} /> Ticket Number
              </span>
              <span className="font-mono font-bold text-sm text-[var(--color-ink)]">
                {ticket.ticket_number}
              </span>
            </div>

            <div>
              <span className="text-[var(--color-muted)] font-medium flex items-center gap-1 mb-1">
                <User size={12} /> Attendee
              </span>
              <span className="font-semibold text-sm text-[var(--color-ink)]">
                {attendeeName || 'Guest Attendee'}
              </span>
              {attendeeId && (
                <span className="block text-[10px] text-[var(--color-muted)] font-mono">
                  PK: attendee_id #{attendeeId}
                </span>
              )}
            </div>

            <div>
              <span className="text-[var(--color-muted)] font-medium flex items-center gap-1 mb-1">
                <Calendar size={12} /> Issued Date
              </span>
              <span className="font-semibold text-[var(--color-ink)]">
                {formattedDate}
              </span>
            </div>

            <div>
              <span className="text-[var(--color-muted)] font-medium flex items-center gap-1 mb-1">
                <MapPin size={12} /> Venue
              </span>
              <span className="font-semibold text-[var(--color-ink)]">
                Campus Entrance / Check-in Door
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Presentation Stub (1 col) */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--color-surface-soft)] border border-[var(--color-hairline)] text-center">
          <div className="size-40 rounded-xl bg-white p-2 shadow-inner border border-[var(--color-hairline)] flex items-center justify-center overflow-hidden">
            {ticket.qr_data_url ? (
              <img
                src={ticket.qr_data_url}
                alt={`QR code for ticket ${ticket.ticket_number}`}
                className="size-full object-contain"
              />
            ) : ticket.qr_token ? (
              <div className="text-center p-2">
                <div className="font-mono text-[10px] font-bold text-zinc-800 break-all bg-zinc-100 p-2 rounded">
                  {ticket.qr_token.slice(0, 16)}...
                </div>
                <span className="text-[10px] text-[var(--color-muted)] mt-1 block">Token Scan</span>
              </div>
            ) : (
              <span className="text-xs text-[var(--color-muted)]">No QR Available</span>
            )}
          </div>

          <p className="mt-2 text-[11px] font-semibold text-[var(--color-muted)]">
            Scan for Entry
          </p>
          <div className="mt-1 font-mono text-[10px] text-[var(--color-muted-soft)]">
            {ticket.qr_token ? `${ticket.qr_token.slice(0, 8)}…` : ''}
          </div>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="relative border-t-2 border-dashed border-[var(--color-hairline)] px-6 py-3 bg-[var(--color-surface-soft)] flex items-center justify-between text-xs text-[var(--color-muted)]">
        <div className="absolute -left-3 -top-3 size-6 rounded-full bg-[var(--color-canvas)] border border-[var(--color-hairline)]" />
        <div className="absolute -right-3 -top-3 size-6 rounded-full bg-[var(--color-canvas)] border border-[var(--color-hairline)]" />

        <span>Present on phone or print for event entrance check-in.</span>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 font-bold text-[var(--color-ink)] hover:text-[var(--color-brand-accent)] cursor-pointer"
        >
          <Printer size={14} />
          <span>Print Pass</span>
        </button>
      </div>
    </div>
  );
}

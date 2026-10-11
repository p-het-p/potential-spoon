import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MailCheck,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Ticket,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  User,
  Hash
} from 'lucide-react';
import QRCode from 'qrcode';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { getGuestPass } from '../lib/api';

export function GuestPass() {
  const navigate = useNavigate();
  const { attendee, attendeeId, isGuest } = useAuth();
  const [passData, setPassData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const passCardRef = useRef(null);

  // Fallback attendee info if auth state or session is present
  const currentAttendeeId = attendee?.attendee_id || attendeeId || (typeof localStorage !== 'undefined' ? localStorage.getItem('attendee_id') : null);
  const currentEmail = attendee?.email || (typeof localStorage !== 'undefined' ? localStorage.getItem('attendee_email') : null) || 'your registered email';
  const currentName = attendee?.full_name || (typeof localStorage !== 'undefined' ? localStorage.getItem('attendee_name') : null) || currentEmail.split('@')[0];

  useEffect(() => {
    let isMounted = true;

    async function loadPass() {
      setLoading(true);
      try {
        if (currentAttendeeId) {
          const pass = await getGuestPass(currentAttendeeId);
          if (isMounted && pass) {
            setPassData(pass);
            if (pass.qr_data_url) {
              setQrDataUrl(pass.qr_data_url);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch pass from backend, generating local pass', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPass();
    return () => {
      isMounted = false;
    };
  }, [currentAttendeeId]);

  // Generate QR code if not provided by backend
  useEffect(() => {
    if (!qrDataUrl && currentAttendeeId) {
      const qrPayload = JSON.stringify({
        type: 'CAMPUS_GUEST_PASS',
        attendee_id: currentAttendeeId,
        email: currentEmail,
        valid: true,
        issued: new Date().toISOString()
      });

      QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#09090b',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR', err));
    }
  }, [qrDataUrl, currentAttendeeId, currentEmail]);

  const passToken = passData?.qr_token || `GUEST-PASS-${currentAttendeeId || '001'}-${String(currentEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`;

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(passToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Canvas-based download of the digital pass
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1100;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Decorative gradient card
    const cardX = 40;
    const cardY = 40;
    const cardW = width - 80;
    const cardH = height - 80;

    // Outer card rounded rect
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.clip();

    ctx.fillStyle = '#18181b';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Top Header Banner
    ctx.fillStyle = '#27272a';
    ctx.fillRect(cardX, cardY, cardW, 160);

    // Organization badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cardX + 60, cardY + 70, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('CC', cardX + 46, cardY + 77);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('CAMPUS EVENTS & TICKETS', cardX + 105, cardY + 68);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '16px sans-serif';
    ctx.fillText('OFFICIAL NON-MEMBER DIGITAL PASS', cardX + 105, cardY + 98);

    // Gate ready badge
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.roundRect(cardX + cardW - 190, cardY + 50, 150, 42, 21);
    ctx.fill();
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('✓ GATE READY', cardX + cardW - 170, cardY + 77);

    // Pass details
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(currentName, cardX + 50, cardY + 230);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '20px sans-serif';
    ctx.fillText(currentEmail, cardX + 50, cardY + 270);

    // Info grid
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.roundRect(cardX + 50, cardY + 310, cardW - 100, 130, 20);
    ctx.fill();

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '14px sans-serif';
    ctx.fillText('PRIMARY KEY', cardX + 80, cardY + 350);
    ctx.fillText('PASS STATUS', cardX + 320, cardY + 350);
    ctx.fillText('VENUE ACCESS', cardX + 520, cardY + 350);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`attendee_id: #${currentAttendeeId || 1}`, cardX + 80, cardY + 390);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Verified Attendee', cardX + 320, cardY + 390);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('General Gate', cardX + 520, cardY + 390);

    // Perforated line
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 480);
    ctx.lineTo(cardX + cardW - 40, cardY + 480);
    ctx.stroke();
    ctx.setLineDash([]);

    // QR container
    const qrBoxW = 340;
    const qrBoxH = 340;
    const qrBoxX = cardX + (cardW - qrBoxW) / 2;
    const qrBoxY = cardY + 520;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 24);
    ctx.fill();

    // Draw QR code image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrBoxX + 20, qrBoxY + 20, qrBoxW - 40, qrBoxH - 40);

      // Token label underneath
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN FOR DOOR & TICKET CHECK-IN', width / 2, cardY + 910);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(passToken, width / 2, cardY + 945);

      ctx.restore();

      // Trigger download
      const link = document.createElement('a');
      link.download = `Guest-Pass-${currentAttendeeId || 'ticket'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    qrImg.src = qrDataUrl || '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-soft)]">
      <TopNav />

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* ── User Request Requirement: Notification Alert Banner ── */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/80 p-5 sm:p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0 shadow-md">
                <MailCheck size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Email Verification Complete</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 tracking-tight">
                  Your Digital Pass is Ready!
                </h1>
                <p className="mt-1 text-sm text-emerald-900 leading-relaxed">
                  Your pass was sent to your registered email (<strong>{currentEmail}</strong>). You can also download it from here or present it directly on your phone at event gates.
                </p>
              </div>
            </div>
          </div>

          {/* ── Digital Pass Component ── */}
          <div className="flex flex-col items-center">
            {/* Download/Print Action Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-3 text-xs text-[var(--color-muted)] px-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Official Pass Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 font-bold text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <span>•</span>
                <button
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            {/* The Physical-Style Pass Card */}
            <div
              ref={passCardRef}
              id="digital-pass-card"
              className="relative w-full max-w-md rounded-[32px] border-2 border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden transition-all print:border-black print:text-black print:bg-white"
            >
              {/* Header section with brand and status badge */}
              <div className="p-6 pb-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-xl bg-emerald-500 font-black text-sm text-zinc-950 shadow-md">
                      CC
                    </span>
                    <div>
                      <span className="text-[11px] font-black tracking-widest text-zinc-400 block uppercase">
                        Campus Events
                      </span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        Non-Member Pass
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gate Ready</span>
                  </span>
                </div>

                {/* Attendee Details Section */}
                <div className="mt-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Registered Attendee
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white truncate">
                    {currentName}
                  </h2>
                  <p className="text-xs text-zinc-400 truncate">
                    {currentEmail}
                  </p>
                </div>
              </div>

              {/* Middle Metadata Matrix */}
              <div className="p-6 py-5 grid grid-cols-2 gap-4 text-xs bg-zinc-950">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Hash size={11} /> Primary Key (PK)
                  </span>
                  <div className="font-mono text-xs font-extrabold text-emerald-400 bg-zinc-900/90 px-2 py-1 rounded-lg border border-zinc-800 inline-block">
                    attendee_id #{currentAttendeeId || '1'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <ShieldCheck size={11} /> Verification Status
                  </span>
                  <div className="font-semibold text-xs text-zinc-200 flex items-center gap-1.5 pt-0.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span>Email Verified</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Calendar size={11} /> Issued On
                  </span>
                  <p className="font-semibold text-zinc-300">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <MapPin size={11} /> Door Scanner
                  </span>
                  <p className="font-semibold text-zinc-300">
                    Campus Entrance
                  </p>
                </div>
              </div>

              {/* Perforated Divider with Circular Notches */}
              <div className="relative py-2 bg-zinc-950">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-[var(--color-surface-soft)] border border-zinc-800" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-[var(--color-surface-soft)] border border-zinc-800" />
                <div className="border-t-2 border-dashed border-zinc-800 mx-5" />
              </div>

              {/* QR Code Presentation Area */}
              <div className="p-6 pt-4 bg-gradient-to-t from-zinc-900 to-zinc-950 flex flex-col items-center justify-center text-center">
                <div className="p-3.5 rounded-2xl bg-white shadow-xl border-4 border-zinc-800">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`Pass QR Code for Attendee ${currentAttendeeId}`}
                      className="size-48 object-contain"
                    />
                  ) : (
                    <div className="size-48 grid place-items-center text-zinc-400">
                      <QrCode size={40} className="animate-spin" />
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs font-semibold text-zinc-400">
                  Scan at Door for Fast Entrance Check-in
                </p>

                {/* Scannable Token with copy helper */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span>{passToken}</span>
                  <button
                    onClick={handleCopyToken}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Copy Token"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Pass Footer */}
              <div className="bg-zinc-900/90 px-6 py-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Non-transferable Attendee Pass</span>
                <span className="font-mono text-zinc-500">ID #{currentAttendeeId}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full max-w-md mt-6 space-y-3">
              <Button
                variant="primary"
                onClick={handleDownloadImage}
                className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                <Download size={18} />
                <span>Download Digital Pass (PNG)</span>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Link to="/events" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Ticket size={15} />
                    <span>Browse Events</span>
                  </Button>
                </Link>

                <Link to="/cart" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={15} />
                    <span>View Cart</span>
                  </Button>
                </Link>
              </div>

              {/* Conversion Prompt to Club Member */}
              <div className="mt-6 p-4 rounded-2xl border border-violet-200 bg-violet-50/80 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-violet-700" />
                    <span>Want 30% off event tickets?</span>
                  </h3>
                  <p className="text-[11px] text-violet-800 mt-0.5">
                    Members automatically get 30% price drops on every event.
                  </p>
                </div>
                <Link to="/register">
                  <Button variant="primary" className="text-xs font-bold h-8 px-3 whitespace-nowrap bg-violet-700 hover:bg-violet-800">
                    Join Club
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

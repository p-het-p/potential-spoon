import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth';
import { logout as logoutApi } from '../../lib/api';

const linkClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition-none ${isActive ? 'bg-[var(--color-surface-strong)] text-[var(--color-ink)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`;

export function TopNav() {
  const { user, token, isGuest, attendee, attendeeId, logout, clearGuestSession } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const handleLogout = async () => {
    try { await logoutApi(token); } catch {}
    logout();
    clearGuestSession();
    navigate('/');
  };

  const handleExitGuest = () => {
    clearGuestSession();
    navigate('/');
  };

  const links = (
    <>
      <NavLink to="/events" className={linkClass} onClick={close}>Events</NavLink>
      <NavLink to="/products" className={linkClass} onClick={close}>Shop</NavLink>
      <NavLink to="/memberships" className={linkClass} onClick={close}>Membership</NavLink>
      <NavLink to="/guest" className={linkClass} onClick={close}>
        <span className="flex items-center gap-1.5">
          Guest Portal
          {isGuest && <span className="size-1.5 rounded-full bg-emerald-500" />}
        </span>
      </NavLink>
      {user?.role === 'club_leader' && <NavLink to="/manage/events" className={linkClass} onClick={close}>Manage</NavLink>}
      {(user?.role === 'treasurer' || user?.role === 'club_leader') && <NavLink to="/finance" className={linkClass} onClick={close}>Finance</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-[color:rgb(255_253_248_/_0.93)] backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-[var(--color-ink)]">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--color-primary)] text-sm font-black text-white">CC</span>
          <span className="text-[15px] font-extrabold tracking-[-.03em]">Campus Collective</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NavLink to="/cart" className="grid size-10 place-items-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)]" aria-label="Cart">
                <ShoppingBag size={18} />
              </NavLink>
              <NavLink to="/dashboard" className="text-sm font-semibold text-[var(--color-ink)]">
                {user.full_name?.split(' ')[0] || 'Account'}
              </NavLink>
              <button onClick={handleLogout} className="text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                Sign out
              </button>
            </>
          ) : isGuest ? (
            <>
              <Link to="/guest" className="flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:border-emerald-500">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Attendee #{attendeeId || 'Guest'}</span>
              </Link>
              <NavLink to="/cart" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)]">
                <ShoppingBag size={17} /> Cart
              </NavLink>
              <Link to="/register">
                <Button variant="primary" className="text-xs h-8 px-3">Join the Club</Button>
              </Link>
              <button onClick={handleExitGuest} className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]" title="Exit guest mode and continue as visitor">
                Exit Guest
              </button>
            </>
          ) : (
            <>
              <Link to="/guest" className="text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                Guest Pass
              </Link>
              <Link to="/login" className="text-sm font-semibold text-[var(--color-ink)]">
                Sign in
              </Link>
              <Link to="/register">
                <Button>Join the club</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links}
            <hr className="my-3 border-[var(--color-hairline)]" />
            {user ? (
              <>
                <NavLink to="/cart" onClick={close} className={linkClass}>Cart</NavLink>
                <NavLink to="/dashboard" onClick={close} className={linkClass}>Dashboard</NavLink>
                <button onClick={handleLogout} className="px-3 py-2 text-left text-sm font-semibold text-[var(--color-muted)]">Sign out</button>
              </>
            ) : isGuest ? (
              <>
                <div className="px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)]">
                  Active Attendee #{attendeeId || 'Guest'}: {attendee?.email || ''}
                </div>
                <NavLink to="/cart" onClick={close} className={linkClass}>Cart</NavLink>
                <NavLink to="/register" onClick={close} className={linkClass}>Join the Club (Path B)</NavLink>
                <button onClick={handleExitGuest} className="px-3 py-2 text-left text-sm font-semibold text-[var(--color-muted)]">Exit Guest Mode</button>
              </>
            ) : (
              <>
                <NavLink to="/guest" onClick={close} className={linkClass}>Guest Mode</NavLink>
                <NavLink to="/login" onClick={close} className={linkClass}>Sign in</NavLink>
                <NavLink to="/register" onClick={close} className={linkClass}>Join the club</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

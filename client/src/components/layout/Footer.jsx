import { Link } from 'react-router-dom';

export function Footer() {
  return <footer className="border-t border-white/10 bg-[var(--color-surface-dark)] px-6 py-12 text-zinc-400"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row"><div><div className="flex items-center gap-2 text-white"><span className="grid size-8 place-items-center rounded-lg bg-white text-xs font-black text-[var(--color-primary)]">CC</span><span className="font-bold">Campus Collective</span></div><p className="mt-3 max-w-xs text-sm leading-6">A shared home for the events, people, and ideas that bring campus together.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"><Link to="/events" className="hover:text-white">Events</Link><Link to="/products" className="hover:text-white">Shop</Link><Link to="/memberships" className="hover:text-white">Membership</Link><Link to="/guest" className="hover:text-white">Guest access</Link></div></div></footer>;
}

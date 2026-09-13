import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Product", href: "#problem", testid: "nav-product-link" },
  { label: "How it works", href: "#how-it-works", testid: "nav-how-it-works-link" },
  { label: "Built for India", href: "#built-for-india", testid: "nav-built-for-india-link" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-testid="sentinel-navbar"
      className="fixed top-0 inset-x-0 z-50 bg-[#08090E]/80 backdrop-blur-xl border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-logo-link" className="flex items-center gap-2.5 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-amber-500" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            SENTINEL
          </span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 border border-white/10 rounded px-1.5 py-0.5 group-hover:text-amber-400/90 group-hover:border-amber-500/40 transition-colors duration-200">
            dev-monitor
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testid}
              className="text-sm text-zinc-400 hover:text-amber-300 transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            data-testid="nav-cta-join-waitlist"
            className="hidden sm:inline-flex items-center rounded-full border border-amber-500/50 bg-amber-500/10 px-5 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500 hover:text-[#08090E] hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] transition-[background-color,color,box-shadow] duration-300"
          >
            Join Waitlist
          </a>
          <button
            data-testid="nav-mobile-menu-button"
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-300 hover:text-amber-300 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/[0.08] bg-[#0F111A]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest text-zinc-400 hover:text-amber-300 py-2.5 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#waitlist"
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-cta-join-waitlist"
                className="mt-2 inline-flex justify-center rounded-full border border-amber-500/50 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300"
              >
                Join Waitlist
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

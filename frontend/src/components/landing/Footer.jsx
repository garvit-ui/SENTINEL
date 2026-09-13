import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="footer-section"
      className="border-t border-white/[0.08] bg-[#08090E]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="font-display font-bold text-white tracking-tight">
                SENTINEL
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500 max-w-sm">
              Watching the Indian APIs your business depends on — so silent
              failures never reach your customers.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href="#problem" className="text-sm text-zinc-500 hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="text-sm text-zinc-500 hover:text-white transition-colors">How it works</a>
            <a href="#built-for-india" className="text-sm text-zinc-500 hover:text-white transition-colors">Built for India</a>
            <a href="#waitlist" className="text-sm text-zinc-500 hover:text-white transition-colors">Waitlist</a>
            <button
              data-testid="footer-scroll-top-button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
              Top
            </button>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-mono text-[11px] text-zinc-600">
            © 2026 Sentinel · built for Indian developers
          </p>
          <p
            data-testid="footer-system-status"
            className="font-mono text-[11px] text-zinc-600 flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            system_status: all watchers nominal
          </p>
        </div>
      </div>
    </footer>
  );
}

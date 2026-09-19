import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { FAILURE_ENTRIES, PROVIDERS, SEVERITY_STYLES } from "@/data/failures";
import WaitlistForm from "@/components/landing/WaitlistForm";

const EASE = [0.215, 0.61, 0.355, 1];
const SEVERITIES = ["critical", "high", "medium"];

export default function FailureLibrary() {
  const [provider, setProvider] = useState("all");
  const [severity, setSeverity] = useState("all");

  useEffect(() => {
    document.title = "The Failure Library — Sentinel";
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute("content");
    meta?.setAttribute(
      "content",
      "Documented failure patterns across Razorpay, PhonePe, Cashfree, Shiprocket, Delhivery, MSG91 and Gupshup — with sources. The catalogue Sentinel monitors for."
    );
    window.scrollTo(0, 0);
    return () => {
      document.title = "Sentinel — API monitoring for Indian developers";
      if (meta && prev) meta.setAttribute("content", prev);
    };
  }, []);

  const filtered = useMemo(
    () =>
      FAILURE_ENTRIES.filter(
        (e) =>
          (provider === "all" || e.provider === provider) &&
          (severity === "all" || e.severity === severity)
      ),
    [provider, severity]
  );

  return (
    <div data-testid="failure-library-page" className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/[0.08] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" data-testid="library-logo-link" className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-display font-bold text-white tracking-tight">SENTINEL</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 border border-white/10 rounded px-1.5 py-0.5">
              failure library
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              data-testid="library-back-to-site"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
            <a
              href="/#waitlist"
              data-testid="library-cta-join-waitlist"
              className="inline-flex items-center rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
            <BookOpen size={14} />
            public reference · updated as patterns surface
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white max-w-3xl">
            The Failure Library
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            Documented failure patterns across the Indian APIs your stack
            depends on — what actually happens, how to catch it, and the
            sources to prove it. This is the catalogue Sentinel monitors
            against.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-10 space-y-4"
        >
          <div className="flex flex-wrap gap-2" data-testid="provider-filters">
            {["all", ...PROVIDERS].map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                data-testid={`filter-provider-${p}`}
                className={`font-mono text-xs rounded-full border px-3.5 py-1.5 transition-colors duration-200 ${
                  provider === p
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-zinc-400 hover:text-white hover:border-white/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" data-testid="severity-filters">
            {["all", ...SEVERITIES].map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                data-testid={`filter-severity-${s}`}
                className={`font-mono text-[11px] uppercase tracking-wider rounded border px-2.5 py-1 transition-colors duration-200 ${
                  severity === s
                    ? "border-white/60 text-white"
                    : "border-white/10 text-zinc-600 hover:text-zinc-300 hover:border-white/25"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 space-y-5">
          {filtered.length === 0 && (
            <p className="py-16 text-center font-mono text-sm text-zinc-600">
              no patterns match this filter combination
            </p>
          )}
          {filtered.map((entry, i) => (
            <motion.article
              key={entry.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.2), ease: EASE }}
              data-testid={`failure-entry-${entry.slug}`}
              className="card-shine rounded-xl border border-white/[0.08] bg-[#0C0C0C] p-6 sm:p-8 hover:border-white/25 transition-[border-color] duration-300"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`font-mono text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5 ${SEVERITY_STYLES[entry.severity]}`}
                >
                  {entry.severity}
                </span>
                <span className="font-mono text-xs text-zinc-400">{entry.provider}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  {entry.category}
                </span>
              </div>
              <h2 className="mt-4 font-display font-semibold text-lg sm:text-xl text-zinc-100 leading-snug">
                {entry.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                {entry.what}
              </p>
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                    how to catch it
                  </span>
                  {entry.detect}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {entry.sources.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`source-link-${entry.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    {s.label}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-16 rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-8 sm:p-10 text-center"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
            Sentinel watches for these so you don't have to memorize them.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Join the waitlist — early batches get the full failure catalogue as
            pre-configured watch rules.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <WaitlistForm
              inputTestId="library-email-input"
              buttonTestId="library-submit-button"
              successTestId="library-success-message"
              placeholder="you@yourcompany.in"
              buttonLabel="Get Early Access"
            />
          </div>
        </motion.div>

        <p className="mt-12 text-center font-mono text-[11px] text-zinc-600">
          © 2026 Sentinel · built for Indian developers
        </p>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ALERTS = [
  {
    status: "CRITICAL",
    provider: "razorpay",
    event: "Webhook signature mismatch detected",
    details:
      "HMAC-SHA256 verification failing on payment.captured — silent 200 OK, order state never updated",
    time: "2 min ago",
    impact: "₹42,500 recurring order stalled",
  },
  {
    status: "WARNING",
    provider: "shiprocket",
    event: "Undocumented tier restriction hit",
    details:
      "'deliverable: false' returned for serviceable pincode 560001 — no error code, no docs",
    time: "8 min ago",
    impact: "Dispatch blocked for 14 orders",
  },
  {
    status: "CRITICAL",
    provider: "cashfree",
    event: "SDK breaking parameter change",
    details:
      "v3.2 SDK swallowing 422 payload — error object unreachable in catch block",
    time: "14 min ago",
    impact: "Checkout modal unresponsive",
  },
  {
    status: "CRITICAL",
    provider: "razorpay",
    event: "RBI e-mandate cap exception",
    details:
      "Auto-debit > ₹15,000 declined without failure webhook — subscription silently lapsed",
    time: "21 min ago",
    impact: "Subscription billing dropped",
  },
];

const SEVERITY = {
  CRITICAL: "text-white border-white/40 bg-white/10",
  WARNING: "text-zinc-400 border-zinc-500/40 bg-zinc-500/10",
};

export default function LiveAlertCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % ALERTS.length),
      3600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-testid="hero-live-alert-card"
      className="alert-glow relative rounded-xl border border-white/10 bg-[#0C0C0C]/90 backdrop-blur-xl overflow-hidden"
    >
      <div className="scanlines pointer-events-none absolute inset-0 opacity-20 z-10" />

      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/90">
            live · bom1-mumbai
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {ALERTS.map((a, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={a.event}
                layout
                transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
                className={`rounded-lg border p-3 transition-[border-color,background-color,opacity] duration-500 ${
                  isActive
                    ? "border-white/40 bg-white/[0.05] opacity-100"
                    : "border-white/[0.06] bg-white/[0.02] opacity-55"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5 shrink-0 ${SEVERITY[a.status]}`}
                    >
                      {a.status}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 shrink-0">
                      {a.provider}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-600 shrink-0">
                    {a.time}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-zinc-100 truncate">
                  {a.event}
                </p>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-zinc-400">
                      {a.details}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-zinc-200">
                      impact → {a.impact}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="px-4 py-2.5 border-t border-white/[0.08] flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-600">
          7 providers · 214 watch rules
        </span>
        <span className="font-mono text-[10px] text-zinc-400">
          sentineld: healthy
        </span>
      </div>
    </div>
  );
}

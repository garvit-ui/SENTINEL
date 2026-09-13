import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const PROVIDERS = [
  { name: "razorpay", cat: "Payments", watch: "Webhooks · SDK errors · RBI ₹15k e-mandates" },
  { name: "phonepe", cat: "UPI & Gateway", watch: "Callback latency · pending-state polling" },
  { name: "cashfree", cat: "Payouts & Gateway", watch: "Batch drops · SDK parameter breaks" },
  { name: "shiprocket", cat: "Logistics", watch: "Tier limits · silent deliverable flags" },
  { name: "delhivery", cat: "Express Shipping", watch: "Waybill failures · token expiry" },
  { name: "msg91", cat: "SMS & OTP", watch: "DLT template rejections · route drops" },
  { name: "gupshup", cat: "WhatsApp API", watch: "Session window expiry · media errors" },
];

const MARQUEE_ITEMS = [
  "razorpay webhook signature verification",
  "phonepe upi callback timeouts",
  "cashfree payout batch silent failures",
  "shiprocket pincode deliverable:false",
  "delhivery token expiry drops",
  "msg91 dlt rejection alerts",
  "gupshup whatsapp session expiry",
  "rbi e-mandate ₹15,000 cap failures",
];

export default function BuiltForIndia() {
  return (
    <section
      id="built-for-india"
      data-testid="built-for-india-section"
      className="relative py-20 sm:py-28 lg:py-32 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
              03 / Built for Indian Developers
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
              Global tools don't cover Indian providers.{" "}
              <span className="text-gradient-silver">Sentinel lives here.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Dependabot tracks dependencies. Snyk scans vulnerabilities. Generic
              uptime monitors check status codes. None of them know that Razorpay
              can return 200 OK with a broken payload, that Shiprocket gates
              features by undisclosed account tiers, or that RBI e-mandate rules
              silently cap recurring debits at ₹15,000. Sentinel is purpose-built
              for exactly this gap — the failure modes Indian engineering teams
              actually hit in production.
            </p>
          </div>
        </motion.div>

        <motion.div
          data-testid="provider-pill-grid"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {PROVIDERS.map((p) => (
            <div
              key={p.name}
              className="group rounded-lg border border-white/[0.08] bg-[#0C0C0C] p-4 hover:border-white/30 transition-[border-color] duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300">
                  {p.name}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                {p.cat}
              </p>
              <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed">
                {p.watch}
              </p>
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-white/[0.12] p-4 flex items-center gap-2.5 text-zinc-500">
            <MapPin size={16} className="text-zinc-400 shrink-0" />
            <p className="text-xs leading-relaxed">
              Monitored from Indian region nodes — the latency your users
              actually experience.
            </p>
          </div>
        </motion.div>
      </div>

      <div
        data-testid="editorial-marquee-strip"
        className="mt-16 border-y border-white/[0.08] py-4 overflow-hidden"
      >
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                {m}
              </span>
              <span className="font-mono text-xs text-zinc-700">//</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

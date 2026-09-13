import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

const EASE = [0.215, 0.61, 0.355, 1];

export default function WaitlistSection() {
  return (
    <section
      id="waitlist"
      data-testid="waitlist-section"
      className="relative py-20 sm:py-28 lg:py-36 border-t border-white/[0.06] bg-[#0A0A0A] overflow-hidden"
    >
      <div className="hero-glow absolute inset-0 opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
              04 / Early Access
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Be first to protect your integrations.
            </h2>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
              We're onboarding early engineering teams in weekly batches. No
              spam — just launch updates and your access invite.
            </p>

            <div className="mt-8 max-w-lg">
              <WaitlistForm
                large
                inputTestId="waitlist-email-input"
                buttonTestId="waitlist-submit-button"
                successTestId="waitlist-success-message"
                placeholder="dev@yourcompany.in"
                buttonLabel="Join Waitlist"
              />
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
              batches onboarded weekly · read-only access · no code changes
            </p>
          </motion.div>

          <motion.aside
            data-testid="founder-note-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
            className="lg:col-span-5 rounded-xl border border-white/[0.08] border-l-2 border-l-white bg-[#0C0C0C] p-6 sm:p-8"
          >
            <Quote size={22} className="text-white/60" />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              A note from the founder
            </p>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              I'm building this because I kept finding developers on Reddit and
              GitHub silently struggling with the same Razorpay, Shiprocket, and
              Cashfree issues — webhook drops, undocumented limits, SDK breaks —
              with no dedicated tool watching their backs.
            </p>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              If this resonates, join the waitlist. I'll personally reach out to
              every early signup.
            </p>
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-3">
              <div className="h-9 w-9 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-white">S</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-white">
                  Founder, Sentinel
                </p>
                <p className="font-mono text-[11px] text-zinc-500">
                  operations analyst · data science · bengaluru, in
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

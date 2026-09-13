import { motion, useScroll, useTransform } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import LiveAlertCard from "./LiveAlertCard";

const LINES = [
  { text: "Your Razorpay integration", amber: false },
  { text: "just broke.", amber: true },
  { text: "You'll find out in 3 hours.", amber: false },
  { text: "We'll tell you in 30 seconds.", amber: true },
];

const EASE = [0.215, 0.61, 0.355, 1];

export default function Hero() {
  const { scrollY } = useScroll();
  const cardY = useTransform(scrollY, [0, 700], [0, 90]);
  const glowY = useTransform(scrollY, [0, 700], [0, -120]);

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <motion.div style={{ y: glowY }} className="hero-glow absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                API monitoring · built for India
              </span>
            </motion.div>

            <h1
              data-testid="hero-headline"
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white"
            >
              {LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1 -mb-1">
                  <motion.span
                    className={`block ${line.amber ? "text-gradient-amber" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.15 + i * 0.12,
                      ease: EASE,
                    }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              data-testid="hero-subheadline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              className="mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed"
            >
              Real-time monitoring for the Indian APIs your business depends on
              — Razorpay, PhonePe, Cashfree, Shiprocket, and more. Catch silent
              failures and breaking changes before your customers do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              className="mt-8"
            >
              <WaitlistForm
                inputTestId="hero-email-input"
                buttonTestId="hero-submit-button"
                successTestId="hero-success-message"
                placeholder="you@yourcompany.in"
                buttonLabel="Get Early Access"
              />
              <p
                data-testid="hero-secondary-note"
                className="mt-4 text-sm text-zinc-500"
              >
                Built by developers who got burned by silent API failures too.
              </p>
            </motion.div>
          </div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 40, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="lg:col-span-5"
          >
            <LiveAlertCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

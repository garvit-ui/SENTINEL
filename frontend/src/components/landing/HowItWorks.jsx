import { motion } from "framer-motion";
import { Plug, Radar, BellRing, Wrench } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Plug,
    title: "Connect your integration",
    desc: "Lightweight setup — point webhooks through Sentinel or drop in a two-line relay. No changes to your core logic.",
  },
  {
    num: "02",
    icon: Radar,
    title: "We monitor continuously",
    desc: "Webhook health, SDK behaviour, and provider-side changes — across Razorpay, PhonePe, Cashfree, Shiprocket, Delhivery, MSG91, and Gupshup.",
  },
  {
    num: "03",
    icon: BellRing,
    title: "Get alerted instantly",
    desc: "Slack, email, or webhook alerts within 30 seconds — with context on what changed, which payload broke, and why.",
  },
  {
    num: "04",
    icon: Wrench,
    title: "Fix before it costs you",
    desc: "Clear diagnostics and resolution notes for each failure pattern, so your team resolves in minutes — not after the support tickets land.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative py-20 sm:py-28 lg:py-32 border-t border-white/[0.06] bg-[#0A0C12]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400/90 mb-4">
            02 / How It Works
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white max-w-2xl">
            From silent failure to fixed — in four steps.
          </h2>
        </motion.div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map((s) => (
            <motion.li
              key={s.num}
              variants={item}
              data-testid={`step-card-${s.num}`}
              className="group relative rounded-xl border border-white/[0.08] bg-[#0F111A] p-6 hover:border-amber-500/40 transition-[border-color] duration-300"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-4xl font-bold text-white/[0.08] group-hover:text-amber-500/30 transition-colors duration-300">
                  {s.num}
                </span>
                <s.icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-zinc-500 group-hover:text-amber-400 transition-colors duration-300"
                />
              </div>
              <h3 className="mt-5 font-display font-semibold text-lg text-zinc-100">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                {s.desc}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { BellOff, EyeOff, PackageX } from "lucide-react";

const PAINS = [
  {
    icon: BellOff,
    tag: "PAIN 01",
    provider: "razorpay · phonepe",
    title: "Silent webhook failures",
    desc: "Razorpay signature verification fails with zero warning — a 200 OK carrying a broken payload. Your database never updates, orders sit pending, and you find out when a customer complains.",
    testid: "problem-card-silent-webhooks",
  },
  {
    icon: EyeOff,
    tag: "PAIN 02",
    provider: "shiprocket · delhivery",
    title: "Undocumented restrictions",
    desc: "Shiprocket quietly returns 'deliverable: false' for valid pincodes when undocumented account tier limits kick in. No error code, no changelog, no explanation.",
    testid: "problem-card-tier-limits",
  },
  {
    icon: PackageX,
    tag: "PAIN 03",
    provider: "cashfree · razorpay",
    title: "SDK breaking changes",
    desc: "SDK upgrades that swallow error objects or break on silent parameter changes. And recurring payments over ₹15,000 failing under RBI e-mandate rules — with no failure webhook, for years.",
    testid: "problem-card-sdk-breaking-changes",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export default function Problem() {
  return (
    <section
      id="problem"
      data-testid="problem-section"
      className="relative py-20 sm:py-28 lg:py-32 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
            01 / The Problem
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white max-w-2xl">
            Indian APIs don't warn you before they break you.
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            These aren't hypothetical. They're documented patterns — in GitHub
            issues, on r/developersIndia, in support threads that go nowhere.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PAINS.map((p) => (
            <motion.article
              key={p.tag}
              variants={item}
              whileHover={{ y: -4 }}
              data-testid={p.testid}
              className="card-shine group rounded-xl border border-white/[0.08] bg-[#0C0C0C] p-6 sm:p-8 hover:border-white/30 transition-[border-color] duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-white group-hover:border-white/40 transition-colors duration-300">
                  <p.icon size={20} strokeWidth={1.8} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-6 font-display font-semibold text-xl sm:text-2xl text-zinc-100">
                {p.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-zinc-600">
                {p.provider}
              </p>
              <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
                {p.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

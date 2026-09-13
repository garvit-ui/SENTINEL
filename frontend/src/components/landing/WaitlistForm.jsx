import { useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function WaitlistForm({
  inputTestId,
  buttonTestId,
  successTestId,
  placeholder = "Enter your work email",
  buttonLabel = "Get Early Access",
  large = false,
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That doesn't look like a valid email address.");
      return;
    }
    setError("");
    setState("loading");
    try {
      const { data } = await axios.post(`${API}/waitlist`, { email: trimmed });
      setResult(data);
      setState("done");
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#F59E0B", "#FDE68A", "#ffffff"],
        disableForReducedMotion: true,
      });
    } catch (err) {
      setState("idle");
      setError(
        err.response?.data?.detail?.[0]?.msg ||
          "Something went wrong. Try again in a moment."
      );
    }
  };

  if (state === "done" && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        data-testid={successTestId}
        className="rounded-xl border border-amber-500/40 bg-amber-500/[0.06] p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-amber-400 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-display font-semibold text-white">
              {result.status === "already_registered"
                ? "You're already on the list."
                : "You're on the list."}
            </p>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
              Queue position{" "}
              <span className="font-mono text-amber-300">#{result.position}</span>{" "}
              · access batch{" "}
              <span className="font-mono text-amber-300">{result.batch}</span>.
              We onboard in weekly batches — expect a personal email from the
              founder.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex flex-col sm:flex-row gap-3 ${
          large ? "" : "max-w-md"
        } w-full`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          data-testid={inputTestId}
          className={`flex-1 rounded-lg bg-[#0F111A] border border-white/10 px-4 ${
            large ? "py-4 text-base" : "py-3 text-sm"
          } text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/60 transition-[box-shadow,border-color] duration-200`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          data-testid={buttonTestId}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 ${
            large ? "py-4 text-base" : "py-3 text-sm"
          } font-display font-semibold text-[#08090E] hover:bg-amber-400 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] disabled:opacity-60 transition-[background-color,box-shadow] duration-300 whitespace-nowrap`}
        >
          {state === "loading" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {buttonLabel}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-red-400 font-mono"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

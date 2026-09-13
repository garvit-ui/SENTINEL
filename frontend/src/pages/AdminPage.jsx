import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Loader2,
  LogOut,
  ShieldCheck,
  Users,
  Layers,
  Clock,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({ baseURL: API, withCredentials: true });
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const cfg = err.config || {};
    if (err.response?.status === 401 && !cfg._retried && !cfg._skipRefresh) {
      cfg._retried = true;
      try {
        await api.post("/auth/refresh", null, { _skipRefresh: true });
        return api(cfg);
      } catch {
        // fall through to original error
      }
    }
    return Promise.reject(err);
  }
);

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const [auth, setAuth] = useState(null); // null=checking, false=logged out, object=admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setAuth(res.data))
      .catch(() => setAuth(false));
  }, []);

  useEffect(() => {
    if (!auth) return;
    setLoadingData(true);
    api
      .get("/admin/waitlist")
      .then((res) => setData(res.data))
      .catch(() => setData({ total: 0, entries: [] }))
      .finally(() => setLoadingData(false));
  }, [auth]);

  const login = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const { data: user } = await api.post("/auth/login", { email, password });
      setAuth(user);
    } catch (err) {
      setLoginError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // clear local state regardless
    }
    setAuth(false);
    setData(null);
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await api.get("/admin/waitlist/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sentinel-waitlist.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div data-testid="admin-page" className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/[0.08] bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-display font-bold text-white tracking-tight">
              SENTINEL
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 border border-white/10 rounded px-1.5 py-0.5">
              admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              data-testid="admin-back-to-site"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
            {auth && (
              <button
                onClick={logout}
                data-testid="admin-logout-button"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        {auth === null && (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-zinc-500" size={28} />
          </div>
        )}

        {auth === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            data-testid="admin-login-card"
            className="max-w-sm mx-auto rounded-xl border border-white/[0.08] bg-[#0C0C0C] p-8"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <ShieldCheck size={20} className="text-white" />
              <h1 className="font-display font-bold text-xl text-white">
                Founder access
              </h1>
            </div>
            <p className="text-sm text-zinc-500 mb-6">
              Private area. Waitlist signups live here.
            </p>
            <form onSubmit={login} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                data-testid="admin-email-input"
                className="w-full rounded-lg bg-[#080808] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-[box-shadow,border-color] duration-200"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                data-testid="admin-password-input"
                className="w-full rounded-lg bg-[#080808] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-[box-shadow,border-color] duration-200"
              />
              {loginError && (
                <p data-testid="admin-login-error" className="text-sm text-zinc-300 font-mono">
                  error → {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loggingIn}
                data-testid="admin-login-submit-button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-display font-semibold text-black hover:bg-zinc-200 disabled:opacity-60 transition-colors duration-200"
              >
                {loggingIn ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
              </button>
            </form>
          </motion.div>
        )}

        {auth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            data-testid="admin-dashboard"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  waitlist admin
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                  Early access signups
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Signed in as <span className="font-mono text-zinc-300">{auth.email}</span>
                </p>
              </div>
              <button
                onClick={exportCsv}
                disabled={exporting || !data?.total}
                data-testid="export-csv-button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-display font-semibold text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors duration-200"
              >
                {exporting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border border-white/[0.08] bg-[#0C0C0C] p-5">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users size={15} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">total signups</span>
                </div>
                <p data-testid="admin-total-signups" className="mt-2 font-mono text-3xl font-bold text-white">
                  {data ? data.total : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-[#0C0C0C] p-5">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Layers size={15} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">current batch</span>
                </div>
                <p data-testid="admin-current-batch" className="mt-2 font-mono text-3xl font-bold text-white">
                  {data && data.total ? Math.max(...data.entries.map((e) => e.batch)) : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-[#0C0C0C] p-5">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={15} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">latest signup</span>
                </div>
                <p data-testid="admin-latest-signup" className="mt-2 font-mono text-sm text-zinc-200 truncate">
                  {data && data.total ? data.entries[data.entries.length - 1].email : "—"}
                </p>
                <p className="font-mono text-[11px] text-zinc-600 mt-1">
                  {data && data.total ? formatDate(data.entries[data.entries.length - 1].created_at) : ""}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0C0C0C] overflow-hidden">
              {loadingData ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-zinc-500" size={24} />
                </div>
              ) : !data || data.total === 0 ? (
                <p className="py-16 text-center font-mono text-sm text-zinc-600">
                  no signups yet — share the page
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table data-testid="waitlist-entries-table" className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">#</th>
                        <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">email</th>
                        <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">batch</th>
                        <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.entries].reverse().map((entry) => (
                        <tr
                          key={entry.id}
                          data-testid={`waitlist-row-${entry.position}`}
                          className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-sm text-zinc-500">
                            {entry.position}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-sm text-zinc-100">
                            {entry.email}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs text-zinc-300 border border-white/15 rounded px-1.5 py-0.5">
                              B{entry.batch}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">
                            {formatDate(entry.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

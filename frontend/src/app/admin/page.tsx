"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrowserTerminal, ShieldCheck } from "reicon-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const bgImage =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Blurred Industrial Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[8px] brightness-[0.35] contrast-[1.15] scale-105 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#1C2B36]/45 mix-blend-multiply z-0 pointer-events-none" />

      {/* Login Console */}
      <article className="relative z-10 w-full max-w-md bg-[#1C2B36]/95 border border-white/10 p-8 md:p-10 rounded-[2px] shadow-2xl backdrop-blur-md text-white">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <BrowserTerminal className="w-4 h-4 text-[#E8891C] animate-pulse" weight="Filled" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#E8891C] uppercase font-bold">
              CONSOLE DECK: SW-902
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-none mt-3 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            NEURAL ACCESS
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 focus:border-[#E8891C] text-white h-10 pb-1 text-sm font-sans tracking-wide outline-none transition-colors duration-150"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              PASSCODE
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 focus:border-[#E8891C] text-white h-10 pb-1 text-sm font-sans tracking-wide outline-none transition-colors duration-150 placeholder-white/20"
            />
          </div>

          {error && (
            <p className="text-red-400 font-mono text-[10px] uppercase tracking-wide -mt-4">
              ⚠ {error}
            </p>
          )}

          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-slate-100 text-[#1C2B36] font-bold text-sm tracking-widest rounded-[4px] transition-all duration-150 cursor-pointer shadow-md uppercase disabled:opacity-50"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {loading ? "AUTHENTICATING..." : "INITIALIZE STREAM"}
            </button>
          </div>
        </form>

        <footer className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-[9px] tracking-wider text-slate-500">
          <span className="uppercase">SECURED SHELL</span>
          <Link href="/" className="hover:text-slate-300 transition-colors uppercase">
            RETURN TO FORECOURT
          </Link>
        </footer>
      </article>

      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-white/5 border border-white/10 text-white/50 text-[9px] font-mono tracking-widest uppercase">
        <ShieldCheck className="w-3.5 h-3.5 text-[#E8891C]" weight="Filled" />
        SECURED SHELL
      </div>
    </main>
  );
}

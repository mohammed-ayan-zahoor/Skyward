"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("ID-402-BASE");
  const [passcode, setPasscode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect to the Prisma JWT backend auth route in future
    console.log("Initializing secure admin session for:", identifier);
    alert(`Access Denied: Terminal session initialization failed for ${identifier}. Check security passcode credentials.`);
  };

  const bgImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* Blurred Industrial Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-[8px] brightness-[0.35] contrast-[1.15] scale-105 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Steel-blue brand primary color tint overlay */}
      <div className="absolute inset-0 bg-primary/45 mix-blend-multiply z-0 pointer-events-none" />

      {/* Login Console Card */}
      <article className="relative z-10 w-full max-w-md bg-primary/95 border border-slate-muted/25 p-8 md:p-10 rounded-[2px] shadow-2xl backdrop-blur-md text-white">
        
        {/* Console Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase font-bold">
              CONSOLE DECK: SW-902
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading tracking-tight leading-none mt-3 uppercase">
            NEURAL ACCESS
          </h2>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Admin Identifier */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              ADMIN IDENTIFIER
            </label>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-transparent border-b border-slate-muted/50 focus:border-accent text-white h-10 pb-1 text-sm font-sans tracking-wide outline-none shadow-none transition-colors duration-150" 
            />
          </div>

          {/* Passcode / Sequence Key */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              SEQUENCE KEY / PASSCODE
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-transparent border-b border-slate-muted/50 focus:border-accent text-white h-10 pb-1 text-sm font-sans tracking-wide outline-none shadow-none transition-colors duration-150 placeholder-white/20" 
            />
          </div>

          {/* Initialize Button (Pill styled like reference, but matching border-radius rules) */}
          <div className="mt-4 flex flex-col gap-4">
            <button 
              type="submit" 
              className="w-full py-4 bg-white hover:bg-slate-100 text-primary font-heading font-extrabold text-sm tracking-widest rounded-[4px] transition-all duration-150 cursor-pointer shadow-md uppercase"
            >
              INITIALIZE STREAM
            </button>
          </div>
        </form>

        {/* Footer info links */}
        <footer className="mt-10 pt-6 border-t border-slate-muted/15 flex items-center justify-between font-mono text-[9px] tracking-wider text-slate-500">
          <button 
            type="button"
            onClick={() => alert("Security recovery key sequence has been dispatched to engineering console.")}
            className="hover:text-slate-350 transition-colors duration-150 uppercase bg-transparent border-none cursor-pointer"
          >
            ENCRYPTED RECOVERY
          </button>
          <Link 
            href="/"
            className="hover:text-slate-350 transition-colors duration-150 uppercase"
          >
            RETURN TO FORECOURT
          </Link>
        </footer>

      </article>

      {/* Top right security badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-white/5 border border-white/10 text-white/50 text-[9px] font-mono tracking-widest uppercase">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        SECURED SHELL
      </div>

    </main>
  );
}

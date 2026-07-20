"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full px-6 py-12 relative overflow-hidden bg-bg-warm select-none">
      
      {/* 1. Large Typographic Graphic (Desktop View) */}
      <div 
        className="hidden md:flex items-center justify-center leading-none text-primary relative select-none z-10"
        style={{
          fontFamily: "Didot, 'Bodoni MT', Georgia, serif",
          fontSize: "32rem",
          letterSpacing: "-0.02em",
        }}
      >
        <span>4</span>
        {/* Widened zero to provide spacious empty center for the status card */}
        <span className="inline-block scale-x-[1.25] mx-12 relative">0</span>
        
        {/* Overlapping '4' with cutout mask */}
        <span className="relative -ml-[0.05em]">
          {/* Mask Layer - thick background-colored stroke to carve out the overlap margin */}
          <span 
            className="absolute inset-0 select-none text-bg-warm pointer-events-none"
            style={{
              WebkitTextStroke: "24px var(--color-bg-warm)",
              color: "var(--color-bg-warm)",
            }}
          >
            4
          </span>
          {/* Display Layer */}
          <span className="relative z-10 text-primary">4</span>
        </span>
      </div>

      {/* 2. Page Status Card (Centered overlay inside the '0' on desktop, transparent background) */}
      <div className="flex flex-col items-center justify-center text-center z-20 max-w-[240px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <h2 
          className="font-sans text-xl md:text-2xl font-semibold md:text-white md:mix-blend-difference tracking-tight text-slate-800"
          style={{
            WebkitTextStroke: "1px var(--color-primary)",
          }}
        >
          Page Not Available
        </h2>
        <p 
          className="text-xs md:text-white md:mix-blend-difference max-w-xs text-center mt-2 mb-6 font-sans leading-relaxed text-slate-650"
          style={{
            WebkitTextStroke: "0.5px var(--color-primary)",
          }}
        >
          Sorry, this page isn't available anymore or an error occurred.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-[4px] border border-primary hover:bg-primary hover:text-white text-primary text-sm font-semibold transition-all duration-150 cursor-pointer font-sans shadow-xs bg-transparent"
        >
          Go Back
        </button>
      </div>

      {/* 3. Small Typographic Graphic (Mobile View - Stacks at the bottom) */}
      <div 
        className="md:hidden flex items-center justify-center leading-none text-primary/10 select-none mt-12 order-last"
        style={{
          fontFamily: "Didot, 'Bodoni MT', Georgia, serif",
          fontSize: "10rem",
          letterSpacing: "-0.04em",
        }}
      >
        <span>4</span>
        <span>0</span>
        <span className="-ml-[0.06em]">4</span>
      </div>
      
    </div>
  );
}

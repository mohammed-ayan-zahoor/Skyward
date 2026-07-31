import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star } from "reicon-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const metadata: Metadata = {
  title: "About Skyward — B2B Structural Canopy Fabricator",
  description: "Skyward has been engineering wind-rated structural steel canopies for petrol stations and oil majors across India for over 15 years.",
};

export default async function AboutPage() {
  let heroImage = "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&h=500&q=80";

  try {
    const res = await fetch(`${API}/api/installations?featured=true`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const coverPhoto = data[0]?.photos?.[0]?.imageUrl;
      if (coverPhoto) {
        heroImage = coverPhoto.startsWith("http") ? coverPhoto : `${API}${coverPhoto}`;
      }
    }
  } catch {}

  return (
    <main className="min-h-screen bg-bg-warm font-sans flex items-center justify-center p-4 md:p-10 select-none">
      <article className="relative w-full max-w-[1200px] bg-white rounded-[28px] overflow-hidden p-6 md:p-10 border border-slate-muted/15 shadow-xs">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent animate-spin-slow" weight="Filled" />
            <span className="text-xs font-bold tracking-[0.2em] text-slate-800 font-mono">WHO WE ARE</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Inline SVG Social Icons */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-md bg-[#1877F2] flex items-center justify-center text-white hover:scale-105 transition-transform duration-150">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1H13c-2.8 0-5 2.2-5 5v2z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-md bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] flex items-center justify-center text-white hover:scale-105 transition-transform duration-150">
              <svg className="w-5 h-5 stroke-white fill-none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-md bg-[#0A66C2] flex items-center justify-center text-white hover:scale-105 transition-transform duration-150">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-md bg-[#FF0000] flex items-center justify-center text-white hover:scale-105 transition-transform duration-150">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.163c-.272-1.016-1.074-1.819-2.09-2.09-1.847-.47-9.408-.47-9.408-.47s-7.561 0-9.41.47c-1.015.271-1.817 1.074-2.089 2.09-.47 1.848-.47 5.707-.47 5.707s0 3.86.47 5.707c.272 1.016 1.074 1.819 2.09 2.09 1.849.47 9.41.47 9.41.47s7.561 0 9.41-.47c1.016-.271 1.819-1.074 2.09-2.09.47-1.848.47-5.707.47-5.707s0-3.86-.47-5.707zm-14.148 9.266v-6.858l6.39 3.429-6.39 3.429z" />
              </svg>
            </a>
          </div>
        </header>

        {/* Hero image area with steel-blue brand blob */}
        <div className="relative">
          <svg
            viewBox="0 0 1200 500"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-[300px] md:h-[500px] block rounded-[2px]"
            aria-hidden
          >
            <defs>
              <clipPath id="imgClip" clipPathUnits="userSpaceOnUse">
                <path d="
                  M 20 0
                  H 780
                  C 780 100, 880 100, 880 200
                  V 480
                  Q 880 500, 860 500
                  H 20
                  Q 0 500, 0 480
                  V 20
                  Q 0 0, 20 0
                  Z
                " />
              </clipPath>
            </defs>

            {/* Brand primary steel-blue blob — top-right */}
            <path
              fill="var(--color-primary)"
              d="
                M 900 0
                H 1180
                Q 1200 0, 1200 20
                V 460
                Q 1200 480, 1180 480
                H 1020
                Q 1000 480, 1000 460
                V 320
                C 1000 220, 900 220, 900 120
                Z
              "
            />

            {/* Image clipped by imgClip */}
            <image
              href={heroImage}
              x="0"
              y="0"
              width="1200"
              height="500"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#imgClip)"
            />
          </svg>

          {/* Floating stat card - set high contrast colors explicitly */}
          <div className="absolute z-20 right-4 md:right-8 -bottom-6 md:-bottom-4 bg-white rounded-[2px] border border-slate-muted/25 shadow-md px-5 py-3 md:px-6 md:py-4">
            <div className="text-xl md:text-2xl font-heading tracking-tight leading-none text-slate-900">
              <span className="text-accent font-extrabold">350+</span>{" "}
              <span className="font-bold">CANOPIES</span>
            </div>
            <div className="text-xs md:text-sm text-slate-700 mt-1 font-mono uppercase tracking-wider">
              <span className="text-accent font-bold">100%</span> wind-load certified
            </div>
          </div>
        </div>

        {/* Meta row - set high contrast text-slate-700 explicitly */}
        <div className="mt-10 md:mt-12 flex items-center gap-4 text-xs md:text-sm font-mono uppercase tracking-wider text-slate-750">
          <span>
            <span className="text-accent font-bold">15+</span>{" "}
            <span className="text-slate-900 font-bold">years of engineering excellence</span>
          </span>
          <span className="text-slate-300 font-bold">|</span>
          <span>
            <span className="text-accent font-bold">4.8/5</span>{" "}
            <span className="text-slate-900 font-bold">client satisfaction rating</span>
          </span>
        </div>

        {/* Two-column content layout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight text-neutral-950 leading-[1.05]">
              ENGINEERING CANOPIES THAT SECURE YOUR INVESTMENT.
            </h1>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700 leading-relaxed font-sans text-justify">
              <p>
                Our journey began as a team of structural steel fabricators and evolved
                into a premier B2B canopy partner for independent retailers and major oil
                corporations. We specialize in wind-rated, heavy-duty structures that streamline
                site operations and provide robust environmental protection.
              </p>
              <p>
                Every forecourt has its unique structural constraints. We specialize in
                building custom double-cantilever and high-span truss systems tailored to
                your site boundaries, ensuring certified safety compliance, optimized storm water
                drainage, and high-impact corporate branding.
              </p>
            </div>
          </div>

          {/* Sidebar - set text-slate-750 and force !text-white on the link button */}
          <aside className="md:pl-6 md:border-l md:border-slate-muted/15 flex flex-col justify-between text-center md:text-right">
            <div>
              <div className="text-2xl md:text-3xl font-heading font-extrabold tracking-widest text-accent">
                SKYWARD
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-700 mt-1 font-bold">
                Structural Canopy Fabricator
              </div>
            </div>
            <div className="mt-6 md:mt-8">
              <p className="text-sm font-semibold text-slate-900 font-sans">
                Ready to engineer your station's new structural canopy?
              </p>
              <Link
                href="/#contact"
                className="mt-4 inline-flex items-center justify-center gap-3 rounded-[4px] bg-neutral-950 pl-5 pr-2 py-2 !text-white text-xs font-semibold tracking-wider font-sans hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
              >
                REQUEST CONSULTATION
                <span className="w-8 h-8 rounded-[2px] bg-white text-neutral-950 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" weight="Filled" />
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

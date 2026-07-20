export function LogoCloud() {
  return (
    <section className="bg-bg-warm border-b border-slate-muted/10 py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-5">
        
        {/* Trusted Tagline */}
        <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-[0.25em] text-center mb-10 block">
          TRUSTED BY INDIA'S LEADING FUEL COMPANIES
        </span>

        {/* Brand Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40 hover:opacity-75 transition-opacity duration-300">
          
          {/* Shell logo */}
          <div className="flex justify-center items-center h-12 w-full text-slate-800 hover:text-accent transition-colors duration-150" title="Shell">
            <svg className="h-9 w-auto fill-current" viewBox="0 0 24 24" aria-label="Shell Logo">
              <path d="M12 2A9.97 9.97 0 002 12c0 2.21.72 4.25 1.93 5.9L12 22l8.07-4.1A9.97 9.97 0 0022 12c0-5.5-4.5-10-10-10zm0 18.2L5.8 17A7.95 7.95 0 014 12c0-4.4 3.6-8 8-8s8 3.6 8 8c0 1.9-.66 3.65-1.8 5l-6.2 3.2z M12 6c-2.8 0-5 2.2-5 5 0 1.7.8 3.2 2 4.1V12h6v3.1c1.2-.9 2-2.4 2-4.1 0-2.8-2.2-5-5-5z" />
            </svg>
          </div>

          {/* IndianOil Logo */}
          <div className="flex justify-center items-center h-12 w-full text-slate-800 hover:text-accent transition-colors duration-150" title="IndianOil">
            <div className="flex items-center gap-1.5 font-sans font-bold text-sm tracking-tighter">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-label="IndianOil Emblem">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                <rect x="5" y="10.5" width="14" height="3" />
                <circle cx="12" cy="7" r="1.5" />
              </svg>
              <span className="font-heading text-lg tracking-tight font-extrabold">IndianOil</span>
            </div>
          </div>

          {/* HPCL Logo */}
          <div className="flex justify-center items-center h-12 w-full text-slate-800 hover:text-accent transition-colors duration-150" title="HPCL">
            <div className="flex items-center gap-1 font-sans font-bold text-sm tracking-tighter">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24" aria-label="HPCL Emblem">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M9 7h2v4H9V7zm4 0h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2V7zm2 2.5h-1V8.5h1c.3 0 .5.2.5.5s-.2.5-.5.5zM9 13h2v4H9v-4zm4 0h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2v-4zm2 2.5h-1v-1h1c.3 0 .5.2.5.5s-.2.5-.5.5z" />
              </svg>
              <span className="font-heading text-lg tracking-tight font-black">HPCL</span>
            </div>
          </div>

          {/* BPCL Logo */}
          <div className="flex justify-center items-center h-12 w-full text-slate-800 hover:text-accent transition-colors duration-150" title="BPCL">
            <div className="flex items-center gap-1.5 font-sans font-bold text-sm tracking-tighter">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24" aria-label="BPCL Flame">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm3 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
              <span className="font-heading text-base tracking-tight font-extrabold leading-none text-center">BHARAT<br /><span className="text-[10px] tracking-widest font-normal">PETROLEUM</span></span>
            </div>
          </div>

          {/* Reliance Logo */}
          <div className="flex justify-center items-center h-12 w-full text-slate-800 hover:text-accent transition-colors duration-150" title="Reliance">
            <div className="flex items-center gap-1.5 font-sans font-bold text-sm tracking-tighter">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-label="Reliance Industry Logo">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-3-10 3z" />
              </svg>
              <span className="font-heading text-lg tracking-widest font-extrabold uppercase">Reliance</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

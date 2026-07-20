export function LogoCloud() {
  return (
    <section className="bg-bg-warm border-b border-slate-muted/10">
      {/*Container */}
      <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-10 md:py-16">
        {/* Component */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:grid md:grid-cols-5 md:gap-6 opacity-40 grayscale hover:opacity-60 transition-all duration-300">
          
          {/* Shell Typography Badge */}
          <div className="flex justify-center items-center">
            <span className="font-heading font-extrabold text-2xl tracking-widest text-slate-800">
              SHELL
            </span>
          </div>
          
          {/* Indian Oil Typography Badge */}
          <div className="flex justify-center items-center">
            <span className="font-heading font-bold text-xl tracking-wider text-slate-800">
              INDIAN OIL
            </span>
          </div>
          
          {/* HP Typography Badge */}
          <div className="flex justify-center items-center">
            <span className="font-heading font-black text-2xl tracking-tight text-slate-800">
              HPCL
            </span>
          </div>
          
          {/* Bharat Petroleum Typography Badge */}
          <div className="flex justify-center items-center">
            <span className="font-heading font-semibold text-lg tracking-wider text-slate-800 text-center">
              BHARAT PETROLEUM
            </span>
          </div>
          
          {/* Reliance Typography Badge */}
          <div className="flex justify-center items-center">
            <span className="font-heading font-medium text-xl tracking-widest text-slate-800">
              RELIANCE
            </span>
          </div>
          
        </div>
      </div>
    </section>
  );
}

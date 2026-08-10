import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="block bg-primary text-white border-t border-slate-muted/20">
      {/* Container */}
      <div className="py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* Component */}
        <div className="flex-col flex items-center">
          {/* Branded Company Logo */}
          <Link href="/" className="mb-8 inline-block max-w-full">
            <Image
              src="/logo.png"
              alt="Skyward Logo"
              width={265}
              height={65}
              className="h-20 md:h-28 w-auto object-contain select-none"
            />
          </Link>
          
          {/* Pruned Site Navigation Links */}
          <div className="text-center font-semibold flex flex-wrap justify-center gap-6 text-slate-300 font-sans">
            <Link href="/" className="inline-block px-4 py-2 font-normal hover:text-accent transition-colors duration-150 text-sm">
              Home
            </Link>
            <Link href="/work" className="inline-block px-4 py-2 font-normal hover:text-accent transition-colors duration-150 text-sm">
              Installations
            </Link>
            <Link href="/about" className="inline-block px-4 py-2 font-normal hover:text-accent transition-colors duration-150 text-sm">
              About Us
            </Link>
            <Link href="/#location" className="inline-block px-4 py-2 font-normal hover:text-accent transition-colors duration-150 text-sm">
              Location
            </Link>
            <Link href="/#contact" className="inline-block px-4 py-2 font-normal hover:text-accent transition-colors duration-150 text-sm">
              Contact & Quote
            </Link>
          </div>
          
          {/* Divider */}
          <div className="mb-8 mt-8 border-b border-slate-muted/25 w-48"></div>
          
          {/* Social media grid */}
          <div className="mb-12 grid grid-cols-4 max-w-52 gap-8 mx-auto opacity-60 hover:opacity-90 transition-opacity duration-150">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Skyward on Twitter" className="mx-auto flex-col flex max-w-6 items-center justify-center text-slate-400 hover:text-accent transition-colors duration-150">
              <Image src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a945b4ae6cf7b_Vector-1.svg" alt="Twitter" width={24} height={24} className="inline-block invert opacity-80 hover:opacity-100" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Skyward on Facebook" className="mx-auto flex-col flex max-w-6 items-center justify-center text-slate-400 hover:text-accent transition-colors duration-150">
              <Image src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a945560e6cf77_Vector.svg" alt="Facebook" width={24} height={24} className="inline-block invert opacity-80 hover:opacity-100" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Skyward on Instagram" className="mx-auto flex-col flex max-w-6 items-center justify-center text-slate-400 hover:text-accent transition-colors duration-150">
              <Image src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a940535e6cf7a_Vector-3.svg" alt="Instagram" width={24} height={24} className="inline-block invert opacity-80 hover:opacity-100" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Skyward on LinkedIn" className="mx-auto flex-col flex max-w-6 items-center justify-center text-slate-400 hover:text-accent transition-colors duration-150">
              <Image src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9433a9e6cf88_Vector-2.svg" alt="LinkedIn" width={24} height={24} className="inline-block invert opacity-80 hover:opacity-100" />
            </a>
          </div>
          
          <p className="text-sm text-slate-400 font-sans">
            © Copyright 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

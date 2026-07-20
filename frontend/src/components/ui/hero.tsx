"use client";

import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // Define transition variables
  const transition = {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom premium ease-out curve
  };

  return (
    <header className="w-full bg-bg-warm">
      {/* Hero top - Brand Primary Dark Background */}
      <div className="bg-primary text-white border-b border-slate-muted/20 overflow-hidden">
        {/* Container */}
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          
          {/* Animated Title Block */}
          {shouldReduceMotion ? (
            <div>
              <h1 className="mb-6 max-w-4xl text-4xl font-heading tracking-tight md:text-6xl lg:mb-12 md:leading-none">
                STRUCTURAL CANOPIES ENGINEERED FOR THE FUEL SECTOR.
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  href="/work"
                  className="rounded-[4px] bg-accent hover:bg-amber-600 px-8 py-4 text-center font-semibold text-white flex items-center justify-center gap-2 shadow-sm font-sans"
                >
                  <Folder className="w-5 h-5" />
                  Explore Installations
                </Link>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center rounded-[4px] border border-solid border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 font-bold text-white gap-2 shadow-sm font-sans"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="mb-6 max-w-4xl text-4xl font-heading tracking-tight md:text-6xl lg:mb-12 md:leading-none"
              >
                STRUCTURAL CANOPIES ENGINEERED FOR THE FUEL SECTOR.
              </motion.h1>
              
              {/* Animated Button Group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
              >
                <Link
                  href="/work"
                  className="rounded-[4px] bg-accent hover:bg-amber-600 px-8 py-4 text-center font-semibold text-white transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm font-sans"
                >
                  <Folder className="w-5 h-5" />
                  Explore Installations
                </Link>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center rounded-[4px] border border-solid border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 px-8 py-4 font-bold text-white transition-all duration-150 gap-2 shadow-sm font-sans"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </Link>
              </motion.div>
            </div>
          )}
          
        </div>
      </div>

      {/* Hero bottom - Warm off-white background */}
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16 lg:py-24 bg-bg-warm">
        {/* Component */}
        <div className="relative flex max-w-7xl flex-col gap-8 md:flex-row lg:justify-end">
          {/* Arrow down icon helper */}
          <div className="absolute bottom-0 -left-3 hidden md:block">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a946f0be6cfa0_Frame%2048040.svg"
              alt="Scroll indicator"
              className="w-10 h-10 opacity-30 animate-bounce"
            />
          </div>
          
          <div className="max-w-xl md:mr-[540px] lg:mr-auto">
            {/* Title */}
            <h3 className="text-2xl font-heading text-primary uppercase tracking-wide">Engineering Excellence</h3>
            {/* Divider */}
            <div className="my-6 w-16 border-t-2 border-accent"></div>
            <p className="text-base text-slate-muted font-sans leading-relaxed">
              Skyward is a premier B2B structural canopy fabricator serving independent petrol stations and major oil companies. 
              We build heavy-duty wind-rated steel canopy structures designed for maximum durability, visual appeal, and swift on-site installation. 
              From double-cantilever highway plazas to flat-roof forecourts, our designs integrate seamless water drainage, electrical conduit routing, and certified lighting layouts.
            </p>
          </div>
          
          {/* Image - high quality gas station canopy photo */}
          {shouldReduceMotion ? (
            <img
              src="https://petrolpumpcanopy.in/wp-content/uploads/2025/08/iocl-pump-canopy.jpg"
              alt="IOCL petrol station canopy by Skyward"
              className="relative rounded-[2px] border border-slate-muted/20 shadow-none mt-8 w-full md:w-[480px] object-cover md:absolute md:mt-0 md:h-[480px] md:bottom-0 md:right-0"
            />
          ) : (
            <motion.img
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: 0.25 }}
              src="https://petrolpumpcanopy.in/wp-content/uploads/2025/08/iocl-pump-canopy.jpg"
              alt="IOCL petrol station canopy by Skyward"
              className="relative rounded-[2px] border border-slate-muted/20 shadow-none mt-8 w-full md:w-[480px] object-cover md:absolute md:mt-0 md:h-[480px] md:bottom-0 md:right-0"
            />
          )}
        </div>
      </div>
    </header>
  );
}

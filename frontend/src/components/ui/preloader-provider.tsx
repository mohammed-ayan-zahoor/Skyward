"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after a 1.5 second loading sequence
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Intercept anchor clicks for a slow, premium eased scroll
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (!link) return;
      
      const href = link.getAttribute("href");
      if (!href) return;
      
      // Check if it's a hash anchor pointing to the current page (e.g., "#contact" or "/#contact")
      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        const hash = href.substring(href.indexOf("#"));
        const targetElement = document.querySelector(hash);
        
        if (targetElement) {
          e.preventDefault();
          
          const duration = 1500; // 1.5 seconds for a slow, premium, satisfying glide
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          let startTime: number | null = null;
          
          // Eased Quintic Curve for smooth deceleration
          const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);
          
          const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeOutQuint(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            } else {
              window.history.pushState(null, "", hash);
            }
          };
          
          requestAnimationFrame(animation);
        }
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, []);

  // Handle page-load hash smooth scroll after preloader dismisses
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const targetElement = document.querySelector(hash);
      
      if (targetElement) {
        setTimeout(() => {
          const duration = 1800; // Slightly slower glide for entrance page-load
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          let startTime: number | null = null;
          
          const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);
          
          const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeOutQuint(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          };
          
          requestAnimationFrame(animation);
        }, 150);
      }
    }
  }, [loading]);

  const transitionTuple: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              y: -24,
              transition: { duration: 0.6, ease: transitionTuple }
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-warm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: transitionTuple }}
              className="flex flex-col items-center"
            >
              {/* Branded Company Logo */}
              <img
                src="/logo.png"
                alt="Skyward Logo"
                className="h-32 md:h-40 w-auto object-contain select-none mb-6"
              />
              
              {/* Premium Progress Bar */}
              <div className="w-32 h-[1px] bg-slate-muted/20 mt-4 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="h-full bg-accent w-1/2 absolute top-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lock scroll during load to prevent user navigation on white background */}
      <div className={loading ? "overflow-hidden h-screen" : "flex flex-col min-h-screen"}>
        {children}
      </div>
    </>
  );
}

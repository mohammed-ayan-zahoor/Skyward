import { Suspense } from "react";
import type { Metadata } from "next";
import { GalleryContent } from "./gallery-content";

export const metadata: Metadata = {
  title: "Project Gallery — Skyward Structural Canopies",
  description: "Browse PEB structures, warehouses, and other structural canopy work by Skyward for Indian Oil, BPCL, HPCL, Nayara, and Reliance.",
};

export default function GalleryPage() {
  return (
    <div className="flex-1 bg-bg-warm min-h-screen py-12 md:py-20">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-5 py-20 text-center font-mono text-sm text-slate-500">
            Loading catalog...
          </div>
        }
      >
        <GalleryContent />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { GalleryContent } from "./gallery-content";

export const metadata: Metadata = {
  title: "Project Gallery — PEB, Warehouses & Petrol Station Canopies",
  description:
    "Browse completed PEB industrial buildings, high-capacity logistic warehouses, and petrol station canopy installations by Skyward for HPCL, BPCL, Indian Oil, Nayara, and independent fuel retailers across Karnataka.",
  alternates: { canonical: "https://skywardkgf.com/work" },
  openGraph: {
    title: "Project Gallery — PEB, Warehouses & Petrol Station Canopies | Skyward",
    description:
      "Browse completed PEB industrial buildings, logistic warehouses, and petrol station canopy installations by Skyward. Certified steel fabrication for HPCL, BPCL, Indian Oil & independents.",
    url: "https://skywardkgf.com/work",
    images: [{ url: "/hero-construction.jpg", width: 1200, height: 630, alt: "Skyward Project Gallery" }],
  },
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

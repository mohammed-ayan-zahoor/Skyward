"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Location, Setting, Calendar } from "reicon-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface ApiInstallation {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description?: string;
  brand?: string;
  isFeatured: boolean;
  photos: { imageUrl: string; caption?: string }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB Structure",
  warehouse: "Warehouse",
  other: "Other Structural Work",
};

const staticProducts = [
  {
    id: "prod-peb-columns",
    title: "Heavy-Duty PEB Steel Columns",
    type: "Structural Material",
    description: "Grade 350 structural steel columns pre-engineered with internal utility channels for electrical and drainage lines.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&h=450&q=80",
  },
  {
    id: "prod-fascia-sheets",
    title: "Curved Aluminum Canopy Fascia Sheets",
    type: "Fascia Panel",
    description: "Corrosion-resistant powder-coated aluminum fascia sheets available in custom oil major corporate colors.",
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "prod-led-lights",
    title: "High-Lumen Cleanroom LED Underdeck Lights",
    type: "Lighting Fixture",
    description: "IP66 dust and moisture-proof recessed LED lights designed specifically for petrol station underdeck mounts.",
    imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&h=400&q=80",
  },
];

export function GalleryContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "products" ? "products" : "works";
  const activeCategory = searchParams.get("category");

  const [works, setWorks] = useState<ApiInstallation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/installations`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setWorks(data))
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, []);

  const workItems = works.filter((w) => {
    if (!activeCategory) return true;
    return w.canopyType === activeCategory;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
      {/* Header Section */}
      <div className="max-w-2xl mb-8 md:mb-12">
        <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">
          {activeTab === "products" ? "Catalog" : "Showcase"}
        </span>
        <h1 className="text-3xl md:text-6xl font-heading tracking-tight text-slate-900 leading-none mb-4 uppercase">
          {activeTab === "products" ? "Materials & Products" : "Project Gallery"}
        </h1>
        <p className="text-slate-650 font-sans text-sm md:text-base leading-relaxed">
          {activeTab === "products"
            ? "Explore high-grade materials, structural components, lighting fixtures, and custom panels engineered by Skyward for industrial installations."
            : "Browse our completed Pre-Engineered Buildings (PEB), logistic warehouses, and special structural work commissioned by leading B2B fuel majors."}
        </p>
      </div>

      {/* Tab Selector & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-muted/20 pb-6 mb-10">
        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-[4px] self-start">
          <Link
            href="/work"
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[2px] transition-colors ${
              activeTab === "works"
                ? "bg-primary !text-white"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            Fabrications & Installations
          </Link>
          <Link
            href="/work?tab=products"
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[2px] transition-colors ${
              activeTab === "products"
                ? "bg-primary !text-white"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            Products We Use
          </Link>
        </div>

        {/* Works category sub-filters */}
        {activeTab === "works" && (
          <div className="flex flex-wrap gap-2 text-xs font-mono font-bold uppercase">
            <Link
              href="/work"
              className={`px-3 py-1.5 rounded-[2px] border ${
                !activeCategory
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-slate-muted/25 text-slate-600 hover:border-slate-500"
              }`}
            >
              All
            </Link>
            <Link
              href="/work?category=peb"
              className={`px-3 py-1.5 rounded-[2px] border ${
                activeCategory === "peb"
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-slate-muted/25 text-slate-600 hover:border-slate-500"
              }`}
            >
              PEB
            </Link>
            <Link
              href="/work?category=warehouse"
              className={`px-3 py-1.5 rounded-[2px] border ${
                activeCategory === "warehouse"
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-slate-muted/25 text-slate-600 hover:border-slate-500"
              }`}
            >
              Warehouse
            </Link>
            <Link
              href="/work?category=other"
              className={`px-3 py-1.5 rounded-[2px] border ${
                activeCategory === "other"
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-slate-muted/25 text-slate-600 hover:border-slate-500"
              }`}
            >
              Other Structural Work
            </Link>
          </div>
        )}
      </div>

      {/* Grid Display */}
      {activeTab === "products" ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {staticProducts.map((item, index) => (
            <ScrollReveal
              key={item.id}
              direction="up"
              duration={0.6}
              delay={index * 0.05}
              className="break-inside-avoid mb-6"
            >
              <div className="bg-white border border-slate-muted/15 rounded-[2px] p-4 flex flex-col gap-3 group transition-all duration-150 shadow-none hover:border-slate-muted/30">
                <div className="relative overflow-hidden rounded-[2px]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-[2px] transition-transform duration-300 group-hover:scale-102"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-slate-900 leading-tight group-hover:text-accent transition-colors duration-150">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {item.description}
                </p>
                <div className="h-px w-full bg-slate-muted/10"></div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <Setting className="w-3.5 h-3.5 text-slate-400" weight="Filled" />
                  <span>{item.type}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : loading ? (
        <div className="py-20 text-center font-mono text-sm text-slate-400 uppercase tracking-widest">
          Loading installations registry...
        </div>
      ) : workItems.length === 0 ? (
        <div className="py-20 text-center text-slate-500 font-sans text-sm">
          No installations found in this section.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {workItems.map((item, index) => {
            const coverUrl = item.photos && item.photos[0]?.imageUrl
              ? (item.photos[0].imageUrl.startsWith("http") ? item.photos[0].imageUrl : `${API}${item.photos[0].imageUrl}`)
              : "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&h=400&q=80";

            const catType = CATEGORY_LABELS[item.canopyType] || item.canopyType;

            return (
              <ScrollReveal
                key={item.id}
                direction="up"
                duration={0.6}
                delay={index * 0.05}
                className="break-inside-avoid mb-6"
              >
                <div className="bg-white border border-slate-muted/15 rounded-[2px] p-4 flex flex-col gap-3 group transition-all duration-150 shadow-none hover:border-slate-muted/30">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-[2px]">
                    <img
                      src={coverUrl}
                      alt={item.title}
                      className="w-full h-auto object-cover rounded-[2px] transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />
                  </div>

                  {/* Metadata & Title */}
                  <div className="flex flex-col gap-1">
                    {item.brand && (
                      <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
                        {item.brand}
                      </span>
                    )}
                    <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-slate-900 leading-tight group-hover:text-accent transition-colors duration-150">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Divider Line */}
                  <div className="h-px w-full bg-slate-muted/10"></div>

                  {/* Tech Specs Monospace Badges */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <Location className="w-3.5 h-3.5 text-slate-400" weight="Filled" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Setting className="w-3.5 h-3.5 text-slate-400" weight="Filled" />
                      <span>{catType}</span>
                    </div>
                    {item.yearCompleted && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" weight="Filled" />
                        <span>{item.yearCompleted}</span>
                      </div>
                    )}
                  </div>

                  {/* Read Detail Link (Works only) */}
                  <Link
                    href={`/work/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-accent transition-colors duration-150 mt-2 font-sans"
                  >
                    View Engineering Detail
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

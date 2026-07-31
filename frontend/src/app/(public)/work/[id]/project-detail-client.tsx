"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Location, Setting, Calendar, Star, ArrowRight, ShieldAlert, Download, CheckCircle, Phone } from "reicon-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "";

interface Photo {
  id: string;
  imageUrl: string;
  caption?: string;
  isCover: boolean;
  sortOrder: number;
}

interface Installation {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description: string;
  isFeatured: boolean;
  brand?: string;
  photos: Photo[];
  coverImageId?: string;
}

interface ProjectDetailClientProps {
  project: Installation;
  relatedProjects: Installation[];
}

const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB Structure",
  warehouse: "Warehouse",
  other: "Other Structural Work",
  cantilever: "Cantilever Canopy",
  "curved fascia": "Curved Fascia Canopy",
  "flat-roof": "Flat-Roof Canopy",
};

const formatImageUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&h=800&q=80";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  // Find initial cover photo
  const initialPhoto = project.photos.find((p) => p.isCover) || project.photos[0];
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(initialPhoto || null);

  const activePhotoUrl = selectedPhoto
    ? formatImageUrl(selectedPhoto.imageUrl)
    : formatImageUrl(undefined);

  const categoryTitle = CATEGORY_LABELS[project.canopyType.toLowerCase()] || project.canopyType;

  return (
    <div className="flex-1 bg-bg-warm py-10 md:py-16 font-sans">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 flex flex-col gap-10">

        {/* Top Navigation & Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-slate-muted/20 pb-4">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-650 hover:text-accent uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" weight="Filled" />
            <span>Back to Works Registry</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 uppercase tracking-widest">
            <span>REGISTRY ID //</span>
            <span className="text-slate-900 font-bold font-mono">#{project.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* Hero Header Section */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {project.brand && (
              <span className="bg-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-[2px]">
                {project.brand}
              </span>
            )}
            <span className="text-accent text-[11px] font-mono font-bold uppercase tracking-widest border border-accent/30 px-2.5 py-0.5 rounded-[2px] bg-accent/5">
              {categoryTitle}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
                <Star className="w-3 h-3 text-amber-500" weight="Filled" />
                Featured Case Study
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 uppercase tracking-tight leading-none mt-1">
            {project.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 uppercase tracking-wider mt-1">
            <span className="flex items-center gap-1.5">
              <Location className="w-4 h-4 text-slate-400" weight="Filled" />
              {project.location}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" weight="Filled" />
              COMMISSIONED {project.yearCompleted}
            </span>
          </div>
        </div>

        {/* Main Content Layout: Gallery & Technical Spec Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Interactive Image Viewer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary Main Viewport */}
            <div className="relative aspect-[4/3] w-full bg-slate-900 border border-slate-muted/20 rounded-[2px] overflow-hidden shadow-sm group">
              <img
                src={activePhotoUrl}
                alt={selectedPhoto?.caption || project.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 pointer-events-none" />
              
              {/* Photo Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white flex justify-between items-end">
                <div>
                  <p className="text-xs font-mono tracking-wider text-slate-200 uppercase font-medium">
                    {selectedPhoto?.caption || `${project.title} — Main View`}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-accent tracking-widest font-bold uppercase bg-black/60 px-2 py-1 rounded-[2px]">
                  PHOTO {project.photos.findIndex((p) => p.id === selectedPhoto?.id) + 1} OF {project.photos.length || 1}
                </span>
              </div>
            </div>

            {/* Thumbnails Carousel Grid */}
            {project.photos.length > 1 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
                  Select Site Photograph ({project.photos.length} Available)
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {project.photos.map((photo, idx) => {
                    const isSelected = selectedPhoto?.id === photo.id;
                    const thumbUrl = formatImageUrl(photo.imageUrl);

                    return (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative aspect-square rounded-[2px] overflow-hidden border-2 transition-all cursor-pointer bg-slate-100 ${
                          isSelected
                            ? "border-accent ring-2 ring-accent/30 scale-102"
                            : "border-slate-muted/25 opacity-75 hover:opacity-100 hover:border-slate-400"
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={photo.caption || `Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {photo.isCover && (
                          <span className="absolute top-1 left-1 bg-primary text-white text-[8px] font-mono px-1 py-0.2 rounded-[1px] uppercase tracking-tighter">
                            Cover
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Specification Plate & Engineering Blueprint (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* MANDATORY SIGNATURE SPECIFICATION PLATE */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-[2px] shadow-sm relative flex flex-col gap-5">
              
              {/* Top Plaque Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-900 font-bold">
                    CANOPY SPECIFICATION PLATE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase border border-accent/40 px-2 py-0.5 rounded-[2px]">
                  SPEC // ISO-9001
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                    01 / CLIENT BRAND
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 uppercase tracking-tight block">
                    {project.brand || "INDEPENDENT OUTLET"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                    02 / CANOPY TYPE
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 uppercase tracking-tight block">
                    {categoryTitle}
                  </span>
                </div>

                <div className="space-y-1 border-t border-slate-200 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                    03 / COMMISSION YEAR
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {project.yearCompleted}
                  </span>
                </div>

                <div className="space-y-1 border-t border-slate-200 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                    04 / DISPATCH LOCATION
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 uppercase block">
                    {project.location}
                  </span>
                </div>
              </div>

              {/* Technical Certifications Footer */}
              <div className="border-t border-slate-200 pt-3 flex flex-col gap-2 font-mono text-[10px] text-slate-650 uppercase tracking-wider">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" weight="Filled" />
                    GRADE 350 STRUCTURAL STEEL
                  </span>
                  <span>IS 800:2007 COMPLIANT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" weight="Filled" />
                    HIGH WIND LOAD DESIGNED
                  </span>
                  <span>STAMPED CALCULATIONS</span>
                </div>
              </div>
            </div>

            {/* Scope & Engineering Description */}
            <div className="bg-white border border-slate-muted/20 p-6 rounded-[2px] flex flex-col gap-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-900 font-bold flex items-center gap-2">
                <Setting className="w-4 h-4 text-accent" weight="Filled" />
                Engineering Statement & Scope
              </h3>
              <p className="text-sm text-slate-700 font-sans leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/#contact?project=${encodeURIComponent(project.title)}&type=${encodeURIComponent(project.canopyType)}`}
                className="w-full text-center inline-flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-[4px] transition-all shadow-sm group"
              >
                <span>REQUEST QUOTE FOR SIMILAR CANOPY</span>
                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="tel:+919876543210"
                className="w-full text-center inline-flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 hover:border-slate-500 text-slate-900 font-mono text-xs uppercase tracking-widest font-bold rounded-[4px] transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-600" weight="Filled" />
                <span>SPEAK WITH ENGINEERING DIVISION</span>
              </a>
            </div>

          </div>

        </div>

        {/* Related Projects Showcase */}
        {relatedProjects.length > 0 && (
          <ScrollReveal direction="up" className="mt-12 border-t border-slate-muted/20 pt-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold text-accent font-mono uppercase tracking-widest block mb-1">
                    PORTFOLIO EXPLORER
                  </span>
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold uppercase text-slate-900 tracking-tight">
                    SIMILAR STRUCTURAL INSTALLATIONS
                  </h2>
                </div>
                <Link
                  href="/work"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-700 hover:text-accent uppercase tracking-wider"
                >
                  <span>View All Registry ({relatedProjects.length + 1})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((rel) => {
                  const relCover = rel.photos && rel.photos[0]?.imageUrl
                    ? formatImageUrl(rel.photos[0].imageUrl)
                    : formatImageUrl(undefined);

                  return (
                    <Link
                      key={rel.id}
                      href={`/work/${rel.slug}`}
                      className="bg-white border border-slate-muted/15 rounded-[2px] p-4 flex flex-col gap-3 group transition-all hover:border-slate-muted/30 hover:shadow-xs"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                        <img
                          src={relCover}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        {rel.brand && (
                          <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
                            {rel.brand}
                          </span>
                        )}
                        <h3 className="font-heading font-bold text-base uppercase tracking-tight text-slate-900 group-hover:text-accent transition-colors">
                          {rel.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {rel.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase border-t border-slate-100 pt-2.5 mt-auto">
                        <span>{rel.location}</span>
                        <span className="text-accent font-semibold flex items-center gap-1">
                          View Detail <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
}

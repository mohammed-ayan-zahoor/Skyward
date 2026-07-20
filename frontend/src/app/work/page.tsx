"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Wrench, Calendar } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface ProjectItem {
  id: string;
  title: string;
  brand: string;
  location: string;
  type: string;
  year: string;
  description: string;
  imageUrl: string;
}

export default function GalleryPage() {
  // Mock dataset mimicking dynamic content with various aspect ratios
  const projects: ProjectItem[] = [
    {
      id: "shell-bannerghatta",
      title: "Shell Double-Cantilever",
      brand: "SHELL",
      location: "BENGALURU, KA",
      type: "CANTILEVER",
      year: "2024",
      description: "Heavy-duty double-cantilever steel canopy structure built for high-throughput transit flow.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&h=800&q=80", // Portrait
    },
    {
      id: "iocl-whitefield",
      title: "IOCL Curved Highway Plaza",
      brand: "IOCL",
      location: "WHITEFIELD, KA",
      type: "CURVED FASCIA",
      year: "2023",
      description: "Pre-fabricated curved profile canopy showcasing custom corporate colors and integrated LED conduit channels.",
      imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&h=400&q=80", // Landscape
    },
    {
      id: "hpcl-ecity",
      title: "HPCL Compact Cantilever",
      brand: "HPCL",
      location: "ELECTRONICS CITY, KA",
      type: "SINGLE-COLUMN",
      year: "2024",
      description: "Structural design space-optimized for urban outlets, featuring a single-column cantilever arm truss.",
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&h=600&q=80", // Square
    },
    {
      id: "bpcl-devanahalli",
      title: "BPCL Multi-Bay Truss Plaza",
      brand: "BPCL",
      location: "DEVANAHALLI, KA",
      type: "MODULAR TRUSS",
      year: "2023",
      description: "Multi-bay high-span truss layout engineered to withstand coastal wind loads, pre-wired for fire safety systems.",
      imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&h=450&q=80", // Landscape
    },
    {
      id: "reliance-marathahalli",
      title: "Reliance Flat-Roof Forecourt",
      brand: "RELIANCE",
      location: "MARATHAHALLI, KA",
      type: "FLAT-ROOF",
      year: "2024",
      description: "Classic flat-roof structure with heavy-gauge structural columns and double-welded drainage manifolds.",
      imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&h=900&q=80", // Tall Portrait
    },
    {
      id: "nayara-sarjapur",
      title: "Nayara Custom Curved Canopy",
      brand: "NAYARA",
      location: "SARJAPUR ROAD, KA",
      type: "CURVED FASCIA",
      year: "2023",
      description: "Curved fascia pre-engineered steel structure designed for rapid municipal stamp approvals and on-site crane lift erection.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&h=600&q=80", // Square
    },
  ];

  return (
    <div className="flex-1 bg-bg-warm min-h-screen py-12 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">Showcase</span>
          <h1 className="text-3xl md:text-6xl font-heading tracking-tight text-slate-900 leading-none mb-4">
            PROJECT GALLERY
          </h1>
          <p className="text-slate-650 font-sans text-sm md:text-base leading-relaxed">
            Browse our completed B2B structural canopies. Filtered by wind load compliance, steel grade, and project scope. Click any project to view technical specifications.
          </p>
        </div>

        {/* Pinterest-style CSS Columns Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {projects.map((project) => (
            <ScrollReveal 
              key={project.id} 
              direction="up" 
              duration={0.6}
              className="break-inside-avoid mb-6"
            >
              <div className="bg-white border border-slate-muted/15 rounded-[2px] p-4 flex flex-col gap-3 group transition-all duration-150 shadow-none hover:border-slate-muted/30">
                
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-[2px]">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-auto object-cover rounded-[2px] transition-transform duration-300 group-hover:scale-102"
                  />
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />
                </div>

                {/* Project Title */}
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
                    {project.brand}
                  </span>
                  <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-slate-900 leading-tight group-hover:text-accent transition-colors duration-150">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {project.description}
                </p>

                {/* Divider Line */}
                <div className="h-px w-full bg-slate-muted/10"></div>

                {/* Tech Specs Monospace Badges */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* Read Detail Link */}
                <Link 
                  href={`/work/${project.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-accent transition-colors duration-150 mt-2 font-sans"
                >
                  View Engineering Detail
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                </Link>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </div>
  );
}
